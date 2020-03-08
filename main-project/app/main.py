from flask import Flask, jsonify, request, abort, session, redirect, url_for, escape
from flask_cors import CORS
import os
import bcrypt
from pymongo import MongoClient
from jsonschema import validate
import datetime

import dbworker
import mailsane
from schemaprovider import SchemaFactory

# Start the app and setup the static directory for the html, css, and js files.

STATIC_FOLDER = 'client/build'
# STATIC_FOLDER = 'static' # Default static folder to display warnings
# if os.path.exists('client/build'):
#     # React app was built
#     # Well, the folder exists at least, might as well try to serve it
#     STATIC_FOLDER = 'client/build'


app = Flask(__name__, static_url_path='', static_folder=STATIC_FOLDER)
CORS(app)

# DO NOT SHOW THIS PUBLICLY. THIS SHOULD BE HIDDEN IF CODE
# IS MADE PUBLIC
# THIS IS USED FOR THE SESSION COOKIE ENCRYPTION
app.secret_key = b'834914j1sdfsdf93jsdlghgsagasd'

# Turn this to False when properly deploying to make sure that all
# debugging routes are shut off.
ENABLE_DEBUG_ROUTES = True

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/api/authenticate', methods=['POST'])
@app.route('/authenticate', methods=['POST'])
def authenticate():
    # Use this route to log in and get a token
    # Takes in a json of the form {email : '', password : ''}

    for x in ['email', 'password']:
        if x not in request.json:
            abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    if dbworker.validateCredentials(str(email), request.json['password']):
        userType = dbworker.getUserType(str(email))
        session['email'] = str(email)
        return jsonify({'userType' : userType, 'success' : True})

    abort(401)

@app.route('/api/logout')
@app.route('/logout')
def logout():
    if 'email' not in session:
        abort(400) # Bad request

    session.pop('email', None)
    return redirect(url_for('index',_external=True,_scheme='https'))

@app.route('/api/updatepassword', methods=['POST'])
@app.route('/updatepassword', methods=['POST'])
def updatePassword():
    # Takes in a json of the form {email : '', password : ''}

    # Validate that the user calling this has access
    # Either that they are the same user or that they are an admin
    for x in ['email', 'password']:
        if x not in request.json:
            abort(400)

    emailSess = mailsane.normalize(session['email'])
    if emailSess.error:
        abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    if dbworker.validateAccess(dbworker.userTypeMap['admin']):
        pass
    else:
        abort(401)

    if getUser(str(email)) is None:
        abort(404)

    dbworker.setPassword(str(email), request.json['password'])
    return jsonify({'success' : True})

@app.route('/api/getclasses')
@app.route('/getclasses')
def getClasses():
    """
    Returns a list of class ids from the database
    """
    if 'email' not in session or session['email'] is None:
        abort(401)

    email = mailsane.normalize(session['email'])
    if email.error:
        abort(400)

    return jsonify({'classList' : dbworker.getClasses(str(email)), 'success' : True})

@app.route('/api/getactiveclasses')
@app.route('/getactiveclasses')
def getActiveClasses():
    """
    Returns a list of active class ids from the database
    """
    if 'email' not in session or session['email'] is None:
        abort(401)

    email = mailsane.normalize(session['email'])
    if email.error:
        abort(400)

    return jsonify({'classList' : dbworker.getClasses(str(email), filt={'ongoing' : True}), 'success' : True})

@app.route('/api/whoami', methods=['GET'])
@app.route('/whoami', methods=['GET'])
def getFullName():
    thisUser = dbworker.getCurrentUser()

    if thisUser is None:
        return jsonify({'firstName' : None, 'lastName' : None, 'success' : False})

    return jsonify({'firstName' : thisUser['firstName'], 'lastName' : thisUser['lastName'], 'success' : True})

@app.route('/api/setupstudentdashboard', methods=['GET'])
@app.route('/setupstudentdashboard', methods=['GET'])
def getStudentDashboardInfo():
    if 'email' not in session or session['email'] is None:
        abort(401)

    email = mailsane.normalize(session['email'])
    if email.error:
        abort(400)

    studentDashboardDict = {}
    classes = dbworker.getClasses(str(email), filt={'ongoing' : True})
    thisStudent = dbworker.getCurrentUser()

    studentDashboardDict['firstName'] = thisStudent['firstName'][:]
    studentDashboardDict['lastName'] = thisStudent['lastName'][:]
    studentDashboardDict['Classes'] = []
    studentDashboardDict['Classes'] = studentDashboardDict['Classes'] + classes['student']

    classReports = dbworker.mclient[dbworker.database]['reports']

    for c in studentDashboardDict['Classes']:
        foundClass = False
        r = 0
        while not foundClass and r < classReports.size():
            if classReports[r]['classId'] == c['id']:
                foundClass = True
            else:
                r += 1
        if foundClass:
            c['nextCourse'] = classReports[r]['nextCourse']
            c['marks'] = classReports[r]['marks']


    return jsonify(studentDashboardDict)


@app.route('/api/setmarkingsection', methods=['POST', 'PATCH'])
def setMarkingSection():
    """
    Takes in a JSON of the following format
    {classId, sectionTitle, weightInfo : JSON}

    weightInfo will be of the form
    {'weight' : Int, 'index' : Int}

    Returns {success : Boolean}

    Sets the weight of sectionTitle in classId to <weight>
    This will override existing values
    """
    if 'classId' not in request.json or 'sectionTitle' not in request.json or 'weightInfo' not in request.json:
        abort(400)

    for x in ['weight', 'index']:
        if x not in request.json['weightInfo']:
            abort(400)

    # Validate credentials here
    if 'email' not in session or session['email'] is None:
        abort(401)

    email = mailsane.normalize(session['email'])
    if email.error:
        abort(400)

    if not dbworker.validateAccess(dbworker.userTypeMap['admin']) and not dbworker.isClassInstructor(str(email), request.json['classId']):
        abort(401)

    dbworker.addMarkingSection(request.json['classId'], request.json['sectionTitle'], request.json['weightInfo'])

    return jsonify({'success' : True})

@app.route('/api/deletemarkingsection', methods=['PATCH'])
def deleteMarkingSection():
    """
    Takes in a JSON of the following format
    {classId, sectionTitle}

    Returns {success : Boolean}

    Deletes mark weights and marks for sectionTitle in <classId>
    """
    # Validate credentials here
    if 'email' not in session or session['email'] is None:
        abort(401)

    email = mailsane.normalize(session['email'])
    if email.error:
        abort(400)

    if not dbworker.validateAccess(dbworker.userTypeMap['admin']) and not dbworker.isClassInstructor(str(email), request.json['classId']):
        abort(401)


    for x in ['classId', 'sectionTitle']:
        if x not in request.json:
            abort(400)

    dbworker.deleteMarkingSection(request.json['classId'], request.json['sectionTitle'])

    return jsonify({'success' : True})

@app.route('/api/setmark', methods=['POST', 'PATCH'])
def setMark():
    """
    Takes in a JSON of the following format
    {classId, studentEmail, sectionTitle, mark : Int}

    Returns {success : Boolean}

    Sets the mark of sectionTitle in classId to <weight>
    This will override existing values
    """
    # Validate credentials here
    if 'email' not in session or session['email'] is None:
        abort(401)

    email = mailsane.normalize(session['email'])
    if email.error:
        abort(400)

    if not dbworker.validateAccess(dbworker.userTypeMap['admin']) and not dbworker.isClassInstructor(str(email), request.json['classId']):
        abort(401)

    for x in ['classId', 'studentEmail', 'sectionTitle', 'mark']:
        if x not in request.json:
            abort(400)


    dbworker.setMark(request.json['classId'], request.json['studentEmail'], request.json['sectionTitle'], request.json['mark'])

    return jsonify({'success' : True})

@app.route('/api/updatecourseinfo', methods=['POST', 'PATCH'])
def updateCourseInfo():
    """
    Takes in a JSON of the following format
    {classId, status : Boolean, newTitle : String}

    Returns {success : Boolean}

    Sets the <ongoing> of classId to <status>, and <courseTitle> to <newTitle>
    """
    # Validate credentials here
    if 'email' not in session or session['email'] is None:
        abort(401)

    email = mailsane.normalize(session['email'])
    if email.error:
        abort(400)

    if not dbworker.validateAccess(dbworker.userTypeMap['admin']) and not dbworker.isClassInstructor(str(email), request.json['classId']):
        abort(401)

    if 'classId' not in request.json or 'status' not in request.json or 'newTitle' not in request.json:
        abort(400)


    # TODO: Validate types

    json = {'ongoing' : request.json['status'], 'courseTitle' : request.json['newTitle']}

    # TODO: Do we need to convert request.json['classId'] to ObjectId?
    dbworker.updateClassInfo(request.json['classId'], json)

    return jsonify({'success' : True})



@app.route('/api/mymarks/')
def getMyMarks():
    """
    Gets a student's marks

    If the logged in user is not a student, then it will return a 403

    Returned structure is {marks : {}, success : Boolean}

    The keys for marks and markingSections will be class _ids
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['student']):
        abort(403)

    email = mailsane.normalize(session['email'])
    if email.error:
        abort(400)

    marks = dbworker.getReports({'studentEmail' : str(email)})

    classList = []
    marksDict = {}

    for m in marks:
        # This is to hide the internal report _ids
        m.pop('_id', None)
        tmpId = m['classId']
        m.pop('classId', None) # This has to be done as ObjectIds not serializable
        m.pop('studentEmail', None)

        classList.append(tmpId)
        marksDict[str(tmpId)] = m

    markingSections = dbworker.getMarkingSectionInformation(filt={'_id' : {'$in' : classList}})

    for cl in classList:
        stredCl = str(cl)
        tmp = {}
        for sectionTitle in markingSections[stredCl]:
            tmp[sectionTitle] = {}

            tmp[sectionTitle]['weight'] = markingSections[stredCl][sectionTitle]['weight']
            tmp[sectionTitle]['index'] = markingSections[stredCl][sectionTitle]['index']

            if sectionTitle in marksDict[stredCl]['marks']:
                # This is to handle the case where a 'None' mark exists
                tmp[sectionTitle]['mark'] = marksDict[stredCl]['marks'][sectionTitle]
            else:
                tmp[sectionTitle]['mark'] = None

        marksDict[stredCl]['marks'] = tmp

    return jsonify({'marks' : marksDict, 'success' : True})

@app.route('/api/checkemail')
def checkEmail():
    """
    Takes in a json of the form {'email' : email_address}

    Returns a json of the form {'message' : error_message, 'valid' : Boolean}

    'message' will refer to the specific reason an email address is invalid
    """

    if 'email' not in request.json:
        abort(400)

    # Use the verification library to check that it is a valid email
    address = mailsane.normalize(request.json['email'])

    if address.error:
        return jsonify({'message' : str(address), 'valid' : False})

    
    if dbworker.getUser(str(address)) is None:
        return jsonify({'message' : 'Email address not found', 'valid' : False})

    return jsonify({'message' : None, 'valid' : True})

@app.route('/api/admin/getusers')
def getUsers():
    """
    Returns a json of the form {'result' : list of users with emails, first and last names, 'success' : True}
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    uList = dbworker.getUsers(projection={'_id' : 0, 'email' : 1, 'firstName': 1, 'lastName' : 1})

    fixedList = []
    for x in uList:
        fixedList.append(x)


    return jsonify({'result' : fixedList, 'success' : True})

@app.route('/api/admin/getuser')
def getUser():
    """
    Takes in a JSON of {'email'}

    Returns {'result' : {user information, no id or password}, 'success' : True}
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if 'email' not in request.json:
        abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    u = dbworker.getUser(str(email))
    if u is None:
        abort(404)

    u.pop('password')
    u.pop('_id')

    return jsonify({'result' : u, 'success' : True})

@app.route('/api/admin/edituser')
def editUser():
    """
    Takes in a json of the form
    {'currentEmail' : email, 'newAttributes' : {...}}

    It can change any attribute that is not the email
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if 'currentEmail' not in request.json or 'newAttributes' not in request.json:
        abort(400)

    email = mailsane.normalize(request.json['currentEmail'])
    if email.error:
        abort(400)

    if dbworker.getUser(email) is None:
        abort(404)

    if request.json['newAttributes'] == {} or 'email' in request.json['newAttributes'] or '_id' in request.json['newAttributes'] or 'password' in request.json['newAttributes']:
        # No changes requested or an attempt was made to change the email or _id or the password
        abort(400)

    dbworker.editUser(str(email), request.json['newAttributes'])

    return jsonify({'success' : True})

# This may be a debug route, not sure, made by Steffy
@app.route('/api/getClasses/<email>', methods=['GET'])
@app.route('/getClasses/<email>', methods=['GET'])
def getUserClasses(email):
    email = mailsane.normalize(email)
    if email.error:
        abort(400)

    classes = {'instructor': [], 'student': []}
    for i in dbworker.mclient[dbworker.database]['classes'].find({'instructors': str(email)}):
        tmp_id = i['_id']
        classes['instructor'].append({"id": str(tmp_id), "name": i['courseTitle'], "ongoing": i['ongoing']})

    for j in dbworker.mclient[dbworker.database]['classes'].find({"students": str(email)}):
        tmp_id = j['_id']
        classes['student'].append({"id": str(tmp_id), "name": j['courseTitle'], "ongoing": j['ongoing']})
    return jsonify(classes)


# Debug routes are below, do not rely on these for any expected behaviour

@app.route('/salt')
def getASalt():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    return str(bcrypt.gensalt())

@app.route('/forcelogin/<int:userid>')
def forcelogin(userid):
    # Used to test how the sessions work
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    userid = str(userid)
    session['email'] = userid
    return redirect(url_for('index',_external=True,_scheme='https'))

@app.route('/checklogin')
def checklogin():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    if 'email' in session:
        return "Logged in as " + session['email']

    return "Not logged in"


@app.route('/addjunk')
def addjunk():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    dbworker.mclient[dbworker.database]['junk'].insert_one({"datetime" : datetime.datetime.now()})

    return "Junk added"

@app.route('/seejunk')
def seejunk():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    outString = ""
    for j in dbworker.mclient[dbworker.database]['junk'].find():
        outString += str(j) + " "

    return outString

@app.route('/clearjunk')
def clearjunk():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    dbworker.mclient[dbworker.database]['junk'].remove()
    return "Cleared!"

@app.route('/addsampleuser/<username>')
def addSampleUser(username):
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    dbworker.createUser(username + '@roma.it', username + '@roma.it', 'Sample', 'User', 'I love rock and roll', 1, '647-111-1111', datetime.datetime.strptime('1970/01/01', '%Y/%m/%d'), 'Parent Name')
    return username

@app.route('/showusers')
def showAllUsersDebug():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    outString = ""
    for j in dbworker.mclient[dbworker.database]['users'].find():
        outString += str(j) + " "

    return outString


@app.route('/dumpsession')
def dumpSession():
    # Dump the session variables that are stored in the cookie
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    return jsonify({'sessionVars' : str(session)})

@app.route('/fixreports')
def fixReportIssues():
    # Fix missing reports
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    return jsonify({'result' : dbworker.addMissingEmptyReports()})

@app.route('/a')
@app.route('/a/')
@app.route('/a/<path:path>')
@app.route('/s')
@app.route('/s/')
@app.route('/s/<path:path>')
@app.route('/t')
@app.route('/t/')
@app.route('/t/<path:path>')
@app.route('/v')
@app.route('/v/')
@app.route('/v/<path:path>')
@app.route('/')
def index(path='/'):
    return app.send_static_file('index.html')

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
