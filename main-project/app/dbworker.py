import bcrypt
import datetime
from pymongo import MongoClient
from flask import session

import mailsane

# DO NOT SHOW THESE CREDENTIALS PUBLICLY
DBUSER = "mccgamma"
DBPASSWORD = "alfdasdf83423j4lsdf8"
MONGOURI = "mongodb://" + DBUSER + ":" + DBPASSWORD + "@ds117535.mlab.com:17535/heroku_9tn7s7md?retryWrites=false"

mclient = MongoClient(MONGOURI)
database = 'heroku_9tn7s7md' # This is a database within a MongoDB instance

# IF DEPLOYING TO DELIVERABLE 2, USE THE FOLLOWING LINES TO SWAP THE DB
# MONGOURI = "mongodb://" + DBUSER + ":" + DBPASSWORD + "@ds249035.mlab.com:49035/heroku_nf9149n7?retryWrites=false"

# mclient = MongoClient(MONGOURI)
# database = 'heroku_nf9149n7' # This is a database within a MongoDB instance


def getUsers(filt={}, projection={}):
    """
    Get all users that match a filter
    """
    return mclient[database]['users'].find(filt, projection)

def getUser(username):
    """
    Return the user associated with 'username' ie. email
    """
    return mclient[database]['users'].find_one({'email' : username})

def getCurrentUser():
    """
    Get the current user associated with whatever email is stored in session
    """
    if 'email' not in session:
        return None

    email = mailsane.normalize(session['email'])
    if email.error:
        return None

    return getUser(str(email))

def validateCredentials(username, password):
    """
    Return a boolean indicating if the password is valid
    """
    user = getUser(username)
    if user is None:
        return False

    return bcrypt.checkpw(password.encode(), user['password'].encode())


def getUserType(username):
    """
    Returns the userType (ie. an integer from 0-4) for username

    Returns None if there is no such user
    """
    user = getUser(username)
    if user is None:
        return None

    return user['userType']

def validateAccessList(expectedUserTypes):
    """
    Validate that the user is logged in, use the information in the
    session data to determine if their username is valid and one of the
    expectedUserTypes, return boolean, True if valid, False if invalid
    """
    if 'email' not in session or session['email'] is None:
        return False

    email = mailsane.normalize(session['email'])
    if email.error:
        return False

    uType = getUserType(str(email))

    for x in expectedUserTypes:
        if uType == x:
            return True

    return False

def validateAccess(expectedUserType):
    """
    Validate a user has a specific access type, not a list of them
    """
    return validateAccessList([expectedUserType])

def createUser(email, parentEmail, firstName, lastName, password, userType, phoneNumber, birthday, parentName):
    """
    Create a user and add them to the database
    """
    salt = bcrypt.gensalt()
    password = password.encode()

    saltedPassword = bcrypt.hashpw(password, salt).decode('utf-8')
    mclient[database]['users'].insert_one({'email' : email, 'parentEmail' : parentEmail, 'firstName' : firstName, 'lastName' : lastName, 'password' : saltedPassword, 'userType' : userType, 'phoneNumber' : phoneNumber, 'birthday' : birthday, 'parentName' : parentName})

def setPassword(email, newPassword):
    """
    Used for updating a password for an existing user
    Matches based off the email, not the parentEmail
    Assumes that the user already exists (you should peform this check)
    """
    salt = bcrypt.gensalt()
    password = newPassword.encode()

    saltedPassword = bcrypt.hashpw(password, salt).decode('utf-8')
    mclient[database]['users'].update_one({'email' : email}, {'$set' : {'password' : saltedPassword}})

def createClass(courseTitle, students, instructors, semester):
    """
    Adds a class to the database

    Students and instructors are lists of emails
    """

    # Returns with 'A field insertedId with the _id value of the inserted document.'
    return mclient[database]['classes'].insert_one({'courseTitle' : courseTitle, 'students' : students, 'instructors' : instructors, 'semester' : semester, 'markingSections' : {}, 'ongoing' : True})

def addStudent(courseId, email):
    """
    Add a student to the class with _id == courseId

    Returns True if successful, False otherwise
    """
    matchingClass = mclient[database]['classes'].find_one({'_id' : courseId})

    if matchingClass is None:
        return False

    lookup = getUser(email)
    if lookup is None or lookup['userType'] != userTypeMap['student']:
        # User is not a valid user to add as a student
        return False

    studentList = matchingClass['students'][:]

    if email in studentList:
        return False

    studentList.append(email)

    mclient[database]['classes'].update_one({'_id' : courseId}, {'$set' : {'students' : studentList}})

    addEmptyReport(courseId, email)

    return True

def addInstructor(courseId, email):
    """
    Add a instructor to the class with _id == courseId

    Returns True if successful, False otherwise
    """
    # TODO: Maybe merge this with addStudent?
    matchingClass = mclient[database]['classes'].find_one({'_id' : courseId})

    if matchingClass is None:
        return False

    lookup = getUser(email)
    if lookup is None or lookup['userType'] == userTypeMap['student']:
        # User is not a valid user to add as an instructor of some sort
        return False

    staffList = matchingClass['instructors'][:]

    if email in staffList:
        return False

    staffList.append(email)

    mclient[database]['classes'].update_one({'_id' : courseId}, {'$set' : {'instructors' : staffList}})

    return True

def removeInstructor(courseId, email):
    """
    Removes an instructor from the class with _id == courseId

    Returns True if successful, False otherwise
    """
    matchingClass = mclient[database]['classes'].find_one({'_id' : courseId})

    if matchingClass is None:
        return False

    found = False
    staffList = [x for x in matchingClass['instructors'] if x != email]

    if len(matchingClass['instructors']) == len(staffList):
        # Instructor was not found in the list
        return False

    mclient[database]['classes'].update_one({'_id' : courseId}, {'$set' : {'instructors' : staffList}}) # TODO: Check if this update was successful

    return True


def getClasses(email, filt={}):
    """
    Returns a json of classes that email has access to, either as a student or instructor or admin

    Each class is of the format {'id' : class_id, 'title' : title}

    filt is a filter that can be used to filter the database a bit
    """
    currUserType = getUserType(email)

    # TODO: Is there a faster way of doing this lookup?
    # Potential issue is that we have to search inside of a db object
    allClasses = mclient[database]['classes'].find(filt)

    retJSON = {'student' : [], 'instructor' : [], 'other' : []}

    for c in allClasses:
        dataToSend = {'id' : str(c['_id']), 'title' : c['courseTitle'], 'ongoing' : c['ongoing']}
        if email in c['students']:
            retJSON['student'].append(dataToSend)
        elif email in c['instructors']:
            retJSON['instructor'].append(dataToSend)
        elif currUserType == userTypeMap['admin']:
            retJSON['other'].append(dataToSend)


    return retJSON

def addHoursLog(email, purpose, paid, datetime, hours):
    """
    Adds an hours log for a user by email
    """
    mclient[database]['hours'].insert_one({'email' : email, 'purpose': purpose, 'paid' : paid, 'dateTime' : datetime, 'hours' : hours})

def getHours(filt={}, projection={}):
    """
    Get all user hours that match a filter
    """
    return mclient[database]['hours'].find(filt, projection)

def getAllClasses():
    allClasses = mclient[database]['classes'].find({})
    
    compiledList = []

    for c in allClasses:
        compiledList.append({'id' : str(c['_id']), 'title' : c['courseTitle'], 'ongoing' : c['ongoing']})
    return compiledList

def addEmptyReport(classId, studentEmail):
    """
    Adds an empty marking report for studentEmail to classId to be filled in later
    """
    mclient[database]['reports'].insert_one({'classId' : classId, 'studentEmail' : studentEmail, 'nextCourse' : "", 'marks' : {}, 'comments' : ""})

def getMarkingSectionInformation(filt={}):
    """
    Gets marking section information according to filt

    Returns a json mapping classId -> markingSection
    """
    matchingClasses = mclient[database]['classes'].find(filt, projection={'markingSections' : 1})


    retJson = {}

    for x in matchingClasses:
        tmpId = x['_id']
        x.pop('_id', None)
        retJson[str(tmpId)] = x['markingSections']

    return retJson


def getReports(filt={}):
    """
    Gets all reports using filter <filt>
    """
    return mclient[database]['reports'].find(filt)

def getClassReports(classId, filt={}):
    """
    Get all reports for a specific class

    Additional filter requirements can be specified with filt
    This will not override the requirement that classId be the class searched for
    """
    filt['classId'] = classId
    return getReports(filt)

def getClass(classId):
    """
    Gets the class associated with classId
    """
    return mclient[database]['classes'].find_one({'_id' : classId})

def addMarkingSection(classId, sectionTitle, weightInfo):
    """
    Adds/overwrites the marking section associated with sectionTitle in classId, using weightInfo
    """
    classContent = getClass(classId)

    classContent['markingSections'][sectionTitle] = weightInfo

    mclient[database]['classes'].update_one({'_id' : classId}, {'$set' : {'markingSections' : classContent['markingSections']}})

def setMark(classId, studentEmail, sectionTitle, mark):
    """
    Set's a student's marking info for <sectionTitle> in
    classId
    """
    reportData = getClassReports(classId, filt={'studentEmail' : studentEmail})

    reportData['marks'][sectionTitle] = mark
    mclient[database]['reports'].update_one({'classId' : classId, 'studentEmail' : studentEmail}, {'$set' : {'marks' : reportData['marks']}})

def deleteMark(classId, studentEmail, sectionTitle):
    """
    Deletes a student's marking info for <sectionTitle> in
    classId
    """
    reportData = getClassReports(classId, filt={'studentEmail' : studentEmail})

    reportData['marks'].pop(sectionTitle, None)
    mclient[database]['reports'].update_one({'classId' : classId, 'studentEmail' : studentEmail}, {'$set' : {'marks' : reportData['marks']}})

def deleteMarkingSection(classId, sectionTitle):
    """
    Deletes a marking section as well as all associated marks for
    <sectionTitle> in class <classId>
    """

    classContent = getClass(classId)
    classContent['markingSections'].pop(sectionTitle, None)
    mclient[database]['classes'].update_one({'_id' : classId}, {'$set' : {'markingSections' : classContent['markingSections']}})

    for s in classContent['students']:
        deleteMark(classId, s, sectionTitle)

def updateClassInfo(classId, json):
    """
    Updates the class info using json
    """
    mclient[database]['classes'].update_one({'_id' : classId}, {'$set' : json})

def setClassActiveStatus(classId, status):
    """
    Sets the active status of a class to status
    """
    # TODO: This may no longer be in use, check later
    mclient[database]['classes'].update_one({'_id': classId}, {'$set' : {'ongoing' : status}})

def editUser(email, changes):
    """
    Takes in a json of changes and forces them in
    """
    mclient[database]['users'].update_one({'email' : email}, {'$set' : changes})

def isClassInstructor(email, classId):
    """
    Returns whether or not <email> is an instructor for <classId>
    """
    cl = mclient[database]['classes'].find_one({'_id' : classId})

    return email in cl['instructors']


def removeStudent(courseId, email):
    """
    Removes a student from the class with _id == courseId

    Returns whether or not the removal was successful
    """
    matchingClass = mclient[database]['classes'].find_one({'_id' : courseId})

    if matchingClass is None:
        return False

    lookup = getUser(email)
    if lookup is None or lookup['userType'] != userTypeMap['student']:
        # User is not a valid user to add as a student
        return False

    studentList = matchingClass['students'][:]

    if email not in studentList:
        return False

    studentList.remove(email)

    backupReport = mclient[database]['reports'].find_one({'email' : email})

    mclient[database]['reports'].remove({'email' : email}) # TODO: Check if this delete worked

    # TODO: If the delete did not work, then it needs to be reverted and false returned

    mclient[database]['classes'].update_one({'_id' : courseId}, {'$set' : {'students' : studentList}}) # TODO: Check if this update worked

    # TODO: If the update did not work, then the whole thing needs to be reverted



    return True

# Routes to fix issues with the database
def addMissingEmptyReports():
    """
    This route will add all missing empty reports to the database

    If a student should have a report but doesn't, this will fix it
    """
    fixCount = 0

    studentList = mclient[database]['users'].find({'userType' : userTypeMap['student']})

    for st in studentList:
        classes = mclient[database]['classes'].find({'students' : {'$in' : [st['email']]}})

        for cl in classes:
            rep = mclient[database]['reports'].find_one({'classId' : cl['_id'], 'studentEmail' : st['email']})

            if rep is None:
                addEmptyReport(cl['_id'], st['email'])
                fixCount += 1

    return fixCount

# Map of text -> userType (integer)
userTypeMap = {}
userTypeMap['default'] = 0
userTypeMap['admin'] = 1
userTypeMap['instructor'] = 2
userTypeMap['volunteer'] = 3
userTypeMap['student'] = 4

if __name__ == "__main__":
    print("This file should not be executed directly.")
