import bcrypt
import datetime
from pymongo import MongoClient
from flask import session

# DO NOT SHOW THESE CREDENTIALS PUBLICLY
DBUSER = "mccgamma"
DBPASSWORD = "alfdasdf83423j4lsdf8"
MONGOURI = "mongodb://" + DBUSER + ":" + DBPASSWORD + "@ds117535.mlab.com:17535/heroku_9tn7s7md?retryWrites=false"

mclient = MongoClient(MONGOURI)

database = 'heroku_9tn7s7md' # This is a database within a MongoDB instance

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

    return getUser(session['email'])

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
    if session['email'] is None:
        return False

    uType = getUserType(session['email'])

    for x in expectedUserTypes:
        if uType == x:
            return True

    return False

def validateAccess(expectedUserType):
    """
    Validate a user has a specific access type, not a list of them
    """
    return validateAccessList([expectedUserType])

def createUser(email, parentEmail, firstName, lastName, password, userType, phoneNumber, age, parentName):
    """
    Create a user and add them to the database
    """
    salt = bcrypt.gensalt()
    password = password.encode()

    saltedPassword = bcrypt.hashpw(password, salt).decode('utf-8')
    mclient[database]['users'].insert_one({'email' : email, 'parentEmail' : parentEmail, 'firstName' : firstName, 'lastName' : lastName, 'password' : saltedPassword, 'userType' : userType, 'phoneNumber' : phoneNumber, 'age' : age, 'parentName' : parentName})

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
    mclient[database]['classes'].insert_one({'courseTitle' : courseTitle, 'students' : students, 'instructors' : instructors, 'semester' : semester, 'markingSections' : {}, 'ongoing' : True})

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

    staffList.append(email)

    mclient[database]['classes'].update_one({'_id' : courseId}, {'$set' : {'instructors' : staffList}})

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

def addEmptyReport(classId, studentEmail):
    """
    Adds an empty marking report for studentEmail to classId to be filled in later
    """
    mclient[database]['reports'].insert_one({'classId' : classId, 'studentEmail' : studentEmail, 'nextCourse' : "", 'marks' : [], 'comments' : ""})

def getClassReports(classId, filt={}):
    """
    Get all reports for a specific class

    Additional filter requirements can be specified with filt
    This will not override the requirement that classId be the class searched for
    """
    filt['classId'] = classId
    return mclient[database]['reports'].find(filt)

def getClass(classId):
    """
    Gets the class associated with classId
    """
    return mclient[database]['classes'].find({'_id' : classId})

def addMarkingSection(classId, sectionTitle, weight):
    """
    Adds/overwrites the marking section associated with sectionTitle in classId, using weight as its new weight
    """
    classContent = getClass(classId)

    classContent['markingSections'][sectionTitle] = weight

    mclient[database]['classes'].update_one({'_id' : classId}, {'$set' : {'markingSections' : classContent['markingSections']}})

def deleteMark(classId, studentEmail, sectionTitle):
    """
    Deletes a student's marking info for <sectionTitle> in
    classId
    """
    # TODO: Implement this
    pass

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


# Map of text -> userType (integer)
userTypeMap = {}
userTypeMap['default'] = 0
userTypeMap['admin'] = 1
userTypeMap['instructor'] = 2
userTypeMap['volunteer'] = 3
userTypeMap['student'] = 4

if __name__ == "__main__":
    print("This file should not be executed directly.")
