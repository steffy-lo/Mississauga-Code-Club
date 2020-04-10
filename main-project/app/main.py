from flask import Flask, jsonify, request, abort, session, redirect, url_for, escape, send_file
from flask_cors import CORS
import os
import bcrypt
from pymongo import MongoClient
from bson.objectid import ObjectId
import bson.errors
from jsonschema import validate, exceptions
import datetime
import pandas as pd

import dbworker
import mailsane
from schemaprovider import SchemaFactory
import spreadSheetHandler
from xlrd import open_workbook, XLRDError
import reportgen
from dateutil.parser import parse
import sys

import config

# Start the app and setup the static directory for the html, css, and js files.

# TODO: Get this working, maybe
STATIC_FOLDER = config.STATIC_FOLDER
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
app.secret_key = config.SECRET_KEY

# Turn this to False when properly deploying to make sure that all
# debugging routes are shut off.
ENABLE_DEBUG_ROUTES = config.ENABLE_DEBUG_ROUTES

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/api/authenticate', methods=['POST'])
@app.route('/authenticate', methods=['POST'])
def authenticate():
    # Use this route to log in and get a token
    # Takes in a json of the form {email : '', password : ''}

    # TODO: Likely need to validate email is good input here
    if request.json is None:
        abort(400)

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

    # TODO: Likely need to validate that email is good input

    # Validate that the user calling this has access
    # Either that they are the same user or that they are an admin
    # TODO: Make this prettier while keeping short circuit
    if request.json is None:
        abort(400)

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

    if dbworker.getUser(str(email)) is None:
        abort(404)

    dbworker.setPassword(str(email), request.json['password'])
    return jsonify({'success' : True})

@app.route('/api/admin/getclasses')
def getAllClasses():
    """
    Returns a list of class ids from the database
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(401)

    return jsonify({'classList' : dbworker.getAllClasses()})

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
    if request.json is None or 'classId' not in request.json or 'sectionTitle' not in request.json or 'weightInfo' not in request.json:
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

    # TODO: Validate types
    try:
        validate(instance=request.json, schema=SchemaFactory.set_marking)
    except exceptions.ValidationError:
        abort(400)

    convClassId = ObjectId(request.json['classId'])

    if not dbworker.validateAccess(dbworker.userTypeMap['admin']) and not dbworker.isClassInstructor(str(email), convClassId):
        abort(401)


    dbworker.addMarkingSection(convClassId, request.json['sectionTitle'], request.json['weightInfo'])

    return jsonify({'success' : True})

@app.route('/api/deletemarkingsection', methods=['PATCH', 'DELETE'])
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

    if request.json is None:
        abort(400)

    for x in ['classId', 'sectionTitle']:
        if x not in request.json:
            abort(400)

    convClassId = ObjectId(request.json['classId'])

    if not dbworker.validateAccess(dbworker.userTypeMap['admin']) and not dbworker.isClassInstructor(str(email), convClassId):
        abort(401)


    dbworker.deleteMarkingSection(convClassId, request.json['sectionTitle'])

    return jsonify({'success' : True})


@app.route('/api/admin/updatecourseinfo', methods=['POST'])
def changeCourseInfo():
    if 'email' not in session or session['email'] is None:
        abort(403)

    if request.json is None or 'classId' not in request.json or 'status' not in request.json or 'newTitle' not in request.json:
        abort(400)
    convClassId = ObjectId(request.json['classId'])
    json = {'ongoing' : request.json['status'], 'courseTitle' : request.json['newTitle']}

    dbworker.updateClassInfo(convClassId, json)

    return jsonify({'success' : True})


@app.route('/api/updatecourseinfo', methods=['POST', 'PATCH'])
def updateCourseInfo():
    """
    Takes in a JSON of the following format
    {classId, status : Boolean, newTitle : String}

    Returns {success : Boolean}

    Sets the <ongoing> of classId to <status>, and <courseTitle> to <newTitle>

    If <semesterInfo> is in request.json, it will update <semester> to <semesterInfo>
    """
    # Validate credentials here
    if 'email' not in session or session['email'] is None:
        abort(403)

    email = mailsane.normalize(session['email'])
    if email.error:
        abort(400)

    if request.json is None or 'classId' not in request.json or 'status' not in request.json or 'newTitle' not in request.json:
        abort(400)

    convClassId = ObjectId(request.json['classId'])
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']) and not dbworker.isClassInstructor(str(email), convClassId):
        abort(401)

    try:
        validate(instance=request.json, schema=SchemaFactory.update_CI)
    except exceptions.ValidationError:
        abort(400)

    json = {'ongoing' : request.json['status'], 'courseTitle' : request.json['newTitle']}

    if 'semesterInfo' in request.json:
        json['semester'] = request.json['semesterInfo']

    dbworker.updateClassInfo(convClassId, json)

    return jsonify({'success' : True})

@app.route('/api/class/<string:class_id>/marking', methods=['GET'])
def getCriteria(class_id):
    if not dbworker.validateAccessList([dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor']]):
        abort(401)

    try:
        cl = dbworker.getClass(ObjectId(class_id))
        if cl is None:
            abort(404)

        to_return = {"courseTitle": cl['courseTitle'], "markingSections": cl['markingSections']}
        to_return['_id'] = str(cl['_id'])
        return jsonify({'result' : to_return, 'success' : True})
    except bson.errors.InvalidId:
        abort(400)


@app.route('/api/getclass', methods=['POST'])
def getClass():
    """
    Takes in a JSON of the form {'_id' : String}

    Returns all the information for a class including _id stringified

    {'result' : None/JSON, 'success' : Boolean}
    """

    if request.json is None or '_id' not in request.json:
        abort(400)

    if not dbworker.validateAccessList([dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor']]):
        abort(401)

    try:
        validate(instance=request.json, schema=SchemaFactory.get_class)
    except exceptions.ValidationError:
        abort(400)

    try:
        cl = dbworker.getClass(ObjectId(request.json['_id']))
        if cl is None:
            abort(404)

        cl['_id'] = str(cl['_id'])
        return jsonify({'result' : cl, 'success' : True})
    except bson.errors.InvalidId:
        abort(400)

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


@app.route('/api/updatereport', methods=['PUT', 'POST'])
def updateReport():
    """
    Takes in a json of the form {'classId' : '123', 'email' : student_email, 'mark' : 90.00, 'comment' : "Great!"}

    Returns a "success" json
    """

    if request.json is None:
        abort(400)

    try:
        validate(instance=request.json, schema=SchemaFactory.report_update)
    except exceptions.ValidationError:
        abort(400)

    if not dbworker.validateAccessList([dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor']]):
        abort(403)

    studentEmail = mailsane.normalize(request.json['email'])

    if studentEmail.error:
        abort(400)
    convClassId = ObjectId(request.json['classId'])
    dbworker.updateReport(convClassId,
                          str(studentEmail),
                          mark={} if 'mark' not in request.json else request.json['mark'],
                          comments='' if 'comments' not in request.json else request.json['comments'],
                          nextCourse='' if 'nextCourse' not in request.json else request.json['nextCourse'])

    return jsonify({'success': True})

@app.route('/api/checkemail')
def checkEmail():
    """
    Takes in a json of the form {'email' : email_address}

    Returns a json of the form {'message' : error_message, 'valid' : Boolean}

    'message' will refer to the specific reason an email address is invalid
    """
    # TODO: Add some sort of timeout?

    # TODO: Sanitize input?

    if request.json is None or 'email' not in request.json:
        abort(400)

    # Use the verification library to check that it is a valid email
    address = mailsane.normalize(request.json['email'])

    if address.error:
        return jsonify({'message' : str(address), 'valid' : False})


    if dbworker.getUser(str(address)) is None:
        return jsonify({'message' : 'Email address not found', 'valid' : False})

    return jsonify({'message' : None, 'valid' : True})

@app.route('/api/loghours', methods=['POST', 'PUT'])
def logHours():
    # request.json['hours'] is currently a string that gets converted server side

    valid_access = [dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor'], dbworker.userTypeMap['volunteer']]

    if not dbworker.validateAccessList(valid_access):
        abort(403)

    if request.json is None:
        abort(400)

    for x in ['email', 'purpose', 'paid', 'hours']:
        if x not in request.json:
            abort(400)

    email = mailsane.normalize(request.json['email'])

    if email.error:
        abort(400)

    hours = 0
    try:
        # Handle conversion from a string to a float
        hours = float(request.json['hours'])
    except:
        abort(400)

    if hours <= 0:
        abort(400)

    date = datetime.datetime.now()

    dbworker.addHoursLog(str(email), request.json['purpose'], request.json['paid'], date, hours)

    return jsonify({'dateTime': date})

@app.route('/api/admin/genhours', methods=['POST', 'PUT'])
def genHours():
    # request.json['hours'] is currently a string that gets converted server side

    valid_access = [dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor'], dbworker.userTypeMap['volunteer']]

    if not dbworker.validateAccessList(valid_access):
        abort(403)

    if request.json is None:
        abort(400)

    for x in ['purpose', 'paid', 'hours', 'dateTime']:
        if x not in request.json:
            abort(400)

    correctedTime = datetime.datetime.strptime(request.json['dateTime'], "%Y-%m-%dT%H:%M:%S.%fZ")

    email = session['email']

    if 'email' in request.json:
        email = mailsane.normalize(request.json['email'])
        if email.error:
            abort(400)

    hours = 0
    try:
        # Handle conversion from a string to a float
        hours = float(request.json['hours'])
    except:
        abort(400)

    if hours <= 0:
        abort(400)

    dbworker.addHoursLog(str(email), request.json['purpose'], request.json['paid'], correctedTime, hours)

    return jsonify({'success' : True})

@app.route('/api/admin/edithours', methods=['PATCH'])
def editHours():
    """
    Takes in a json of the form
    {'currentId' : id of hour log as string, 'newAttributes' : {...}}

    It can change any attribute that is not the _id
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.json is None or 'currentId' not in request.json or 'newAttributes' not in request.json:
        abort(400)

    convClassId = ObjectId(request.json['currentId'])


    if request.json['newAttributes'] == {} or '_id' in request.json['newAttributes']:
        # No changes requested or an attempt was made to change the _id
        abort(400)

    # TODO: Validate that all the changes made are valid
    # ie. ban changes to any invalid attributes

    try:
        validate(instance=request.json, schema=SchemaFactory.edit_hours)
    except exceptions.ValidationError:
        abort(400)

    if 'dateTime' in request.json['newAttributes']:
        # Convert dateTime from string to datetime object
        # See https://stackoverflow.com/questions/969285/how-do-i-translate-an-iso-8601-datetime-string-into-a-python-datetime-object
        correctedTime = None
        try:
            correctedTime = datetime.datetime.strptime(request.json['newAttributes']['dateTime'], "%Y-%m-%dT%H:%M:%S.%fZ")
        except:
            abort(400)

        correctedDict = {}
        for x in request.json['newAttributes']:
            if x == 'dateTime':
                correctedDict['dateTime'] = correctedTime
            else:
                correctedDict[x] = request.json['newAttributes'][x]

        dbworker.editHour(convClassId, correctedDict)
    else:
        dbworker.editHour(convClassId, request.json['newAttributes'])

    return jsonify({'success' : True})

@app.route('/api/admin/deletehour', methods=['POST', 'DELETE'])
def deleteHour():
    """
    Takes in a json of the form
    {'id' : id of hour log as string}

    Deletes the hour associated with id

    Aborts with a 409 in the event that it failed to work in the database
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.json is None or 'id' not in request.json:
        abort(400)

    convClassId = ObjectId(request.json['id'])


    res = dbworker.deleteHour(convClassId)

    if not res:
        # Failure
        abort(409)

    return jsonify({'success' : True})


@app.route('/api/gethours/', methods=['GET'])
@app.route('/api/hours/', methods=['GET'])
def getHours():

    if not dbworker.validateAccessList([dbworker.userTypeMap['admin'],
                                        dbworker.userTypeMap['instructor'],
                                        dbworker.userTypeMap['volunteer']]):
        abort(403)

    pre_email = request.args.get('user', default=None, type=str)

    email = None

    if pre_email is None:
        email = session.get('email')

        if email is None:
            abort(500)
    else:
        if not dbworker.validateAccessList([dbworker.userTypeMap['admin']]):
            abort(403)

        email = mailsane.normalize(pre_email)

        if email.error:
            abort(400)

    hours = dbworker.getHours(filt={"email": str(email)}, projection={'_id' : 1, 'dateTime' : 1, 'purpose': 1, 'hours' : 1, 'paid' : 1})

    hours_list = []
    for doc in hours:
        doc['_id'] = str(doc['_id'])
        hours_list.append(doc)

    return jsonify({"hours": hours_list})


@app.route('/api/report/', methods=['POST'])
def getReport():
    """
    Return a PDF containing all worked/volunteer hours
    """
    report_params = request.json

    if report_params is None:
        abort(400)

    if 'email' not in report_params:
        report_params['email'] = session['email']

    try:
        validate(instance=report_params, schema=SchemaFactory.report_hours)
    except exceptions.ValidationError:
        abort(400)

    email = mailsane.normalize(report_params['email'])

    if email.error:
        abort(400)

    if not dbworker.validateAccessList([dbworker.userTypeMap['admin']]) and str(email) != session['email']:
        # Allows admins to see everyones reports, users to see their own
        abort(403)

    paid_hrs = None

    filt = {"email": str(email)}
    proj = {'_id': 0, 'hours': 1}

    if 'paid' in request.json:
        filt['paid'] = True if request.json['paid'] else False
        paid_hrs = False if request.json['paid'] == 0 else True

    # Convert date ranges into datetime objects and insert into filter
    # Note: to enforce a specific date/time pattern you can also use strptime method:
    # datetime.datetime.strptime(request.json['startRange'], '%Y-%m-%d') (complete pattern: "%Y-%m-%dT%H:%M:%S.%fZ")
    if 'startRange' in report_params and 'endRange' in report_params:
        start_time_stamp = parse(report_params['startRange'])
        end_time_stamp = parse(report_params['endRange'])
        filt["dateTime"] = {'$gte': start_time_stamp, '$lte': end_time_stamp}
    elif 'startRange' in report_params:
        start_time_stamp = parse(report_params['startRange'])
        filt["dateTime"] = {'$gte': start_time_stamp}
    elif 'endRange' in report_params:
        end_time_stamp = parse(report_params['endRange'])
        filt["dateTime"] = {'$lte': end_time_stamp}

    hours = dbworker.getHours(filt=filt, projection=proj)

    hours_list = []
    for doc in hours:
        hours_list.append(float(doc["hours"]))

    file_name = reportgen.hours(email, hours_list, paid_hrs)

    # Once generated, report PDFs are currently stored in the 'app' folder of docker container
    resp_file = send_file(file_name, attachment_filename=file_name)

    if os.path.exists("app/" + file_name):
        os.remove("app/" + file_name)
        return resp_file

    abort(500)


@app.route('/api/report/<string:class_id>/<string:email>', methods=['GET'])
def getStudentReport(class_id, email):
    """
    Return a report for a student for a specific class.
    Expected json is {"email": some_student@student.com, "classId":"5e5ab2f6e7179a5e7ee4e81b"}
    """

    # try:
    #     validate(instance={"email":email, "classId":class_id}, schema=SchemaFactory.report_student)
    # except exceptions.ValidationError:
    #     abort(400)

    email = mailsane.normalize(email)

    if email.error:
        abort(400)

    if not dbworker.validateAccessList([dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor']]):
        abort(403)

    # Must first convert classId string in to a ObjectId before executing query
    convClassId = ObjectId(class_id)

    # Verify: 'email' is an existing user in DB and 'convClassId' is the idea of an existing class
    us = dbworker.getUser(str(email))
    cl = dbworker.getClass(convClassId)
    if us is None or cl is None:
        abort(404)

    if us['userType'] != dbworker.userTypeMap['student']:
        abort(400)

    filt = {"classId": convClassId, "studentEmail": str(email)}
    proj = {'_id': 0}

    report = dbworker.getStudentReport(filt=filt, proj=proj)

    if report is None:
        abort(400)

    # Must convert ObjectId 'classId' into a string before responding
    report['classId'] = str(report['classId'])

    return jsonify({"report": report})


@app.route('/api/admin/getusers')
def getUsers():
    """
    Returns a json of the form {'result' : list of users with emails, first and last names, 'success' : True}
    """
    if not dbworker.validateAccessList([dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor']]):
        abort(403)

    uList = dbworker.getUsers(projection={'_id' : 0, 'email' : 1, 'firstName': 1, 'lastName' : 1, 'userType': 1})

    fixedList = []
    for x in uList:
        fixedList.append(x)


    return jsonify({'result' : fixedList, 'success' : True})

@app.route('/api/getuser', methods=['POST'])
@app.route('/api/admin/getuser', methods=['POST'])
def getUser():
    """
    Takes in a JSON of {'email'}

    Returns {'result' : {user information, no id or password}, 'success' : True}

    This method is not just usable by admins, but by instructors
    """
    if dbworker.validateAccessList([dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor']]):
        pass
    else:
        abort(403)

    if request.json is None or 'email' not in request.json:
        abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    u = dbworker.getUser(str(email))
    if u is None:
        abort(405)

    u.pop('password')
    u.pop('_id')

    now = datetime.datetime.now()

    bday = now
    if 'birthday' in u:
        bday = u['birthday']

    delta = now - bday
    age = int(delta.total_seconds() / (31536000))

    u['age'] = age
    return jsonify({'result' : u, 'success' : True})

@app.route('/api/admin/edituser', methods=['PATCH'])
def editUser():
    """
    Takes in a json of the form
    {'currentEmail' : email, 'newAttributes' : {...}}

    It can change any attribute that is not the email
    """
    sys.stderr.write(str(request.json) + '\n')
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.json is None or 'currentEmail' not in request.json or 'newAttributes' not in request.json:
        abort(400)

    email = mailsane.normalize(request.json['currentEmail'])
    if email.error:
        abort(400)

    if dbworker.getUser(str(email)) is None:
        abort(404)

    if request.json['newAttributes'] == {} or 'email' in request.json['newAttributes'] or '_id' in request.json['newAttributes']:
        # No changes requested or an attempt was made to change the email or _id
        abort(400)

    # TODO: Validate that all the changes made are valid
    # ie. ban changes to any invalid attributes

    # TODO: Validate types of all the changes requested
    try:
        validate(instance=request.json, schema=SchemaFactory.edit_user)
    except exceptions.ValidationError:
        abort(400)

    if 'birthday' in request.json['newAttributes'] or 'password' in request.json['newAttributes']:
        # Convert birthday from string to datetime object
        # See https://stackoverflow.com/questions/969285/how-do-i-translate-an-iso-8601-datetime-string-into-a-python-datetime-object
        correctedTime = None
        try:
            if 'birthday' in request.json['newAttributes']:
                correctedTime = datetime.datetime.strptime(request.json['newAttributes']['birthday'], "%Y-%m-%dT%H:%M:%S.%fZ")
        except:
            abort(400)

        correctedDict = {}
        for x in request.json['newAttributes']:
            if x == 'birthday':
                correctedDict['birthday'] = correctedTime
            elif x == 'password':
                dbworker.setPassword(str(email), request.json['newAttributes']['password'])
            else:
                correctedDict[x] = request.json['newAttributes'][x]

        dbworker.editUser(str(email), correctedDict)
    else:
        dbworker.editUser(str(email), request.json['newAttributes'])


    return jsonify({'success' : True})

@app.route('/api/admin/createcourse', methods=['POST'])
def createCourse():
    """
    Takes in a JSON of {'courseTitle'}

    Returns {'_id' : newId (String), 'success' : True}
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.json is None or 'courseTitle' not in request.json:
        abort(400)

    semester = ""
    if 'semester' in request.json:
        semester = request.json['semester']

    val = dbworker.createClass(request.json['courseTitle'], [], [], [], semester)

    return jsonify({'success' : True})

@app.route('/api/admin/addstudent', methods=['POST'])
def addStudent():
    """
    Takes in a JSON of the structure {'email', 'classId'}

    Adds <email> to <classId> as a student

    Returns {'success' : Boolean}
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.json is None or 'email' not in request.json or 'classId' not in request.json:
        abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    convClassId = ObjectId(request.json['classId'])

    # TODO: Validate types
    us = dbworker.getUser(str(email))
    cl = dbworker.getClass(convClassId)
    if us is None or cl is None:
        abort(404)

    if us['userType'] != dbworker.userTypeMap['student']:
        abort(400)

    return jsonify({'success' : dbworker.addStudent(convClassId, str(email))})

@app.route('/api/admin/addinstructor', methods=['POST'])
def addInstructor():
    """
    Takes in a JSON of the structure {'email', 'classId'}

    Adds <email> to <classId> as an instructor

    Returns {'success' : Boolean}
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.json is None or 'email' not in request.json or 'classId' not in request.json:
        abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    convClassId = ObjectId(request.json['classId'])

    # TODO: Validate types
    us = dbworker.getUser(str(email))
    cl = dbworker.getClass(convClassId)
    if us is None or cl is None:
        abort(404)

    if us['userType'] not in [dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor'], dbworker.userTypeMap['volunteer']]:
        abort(400)

    return jsonify({'success' : dbworker.addInstructor(convClassId, str(email))})

@app.route('/api/admin/removeinstructor', methods=['POST', 'DELETE'])
def removeInstructor():
    """
    Takes in a JSON of the structure {'email', 'classId'}

    Removes <email> from <classId> as an instructor

    Returns {'success' : Boolean}
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.json is None or 'email' not in request.json or 'classId' not in request.json:
        abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    convClassId = ObjectId(request.json['classId'])

    # TODO: Validate types
    us = dbworker.getUser(str(email))
    cl = dbworker.getClass(convClassId)
    if us is None or cl is None:
        abort(404)

    if us['userType'] not in [dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor'], dbworker.userTypeMap['volunteer']]:
        abort(400)



    return jsonify({'success' : dbworker.removeInstructor(convClassId, str(email))})

@app.route('/api/admin/removestudent', methods=['POST', 'DELETE'])
def removeStudent():
    """
    Takes in a JSON of the structure {'email', 'classId'}

    Removes <email> from <classId> as a student

    Returns {'success' : Boolean}
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.json is None or 'email' not in request.json or 'classId' not in request.json:
        abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    convClassId = ObjectId(request.json['classId'])

    # TODO: Validate types
    us = dbworker.getUser(str(email))
    cl = dbworker.getClass(convClassId)
    if us is None or cl is None:
        abort(404)

    if us['userType'] not in [dbworker.userTypeMap['student']]:
        abort(400)



    return jsonify({'success' : dbworker.removeStudent(convClassId, str(email))})

@app.route('/api/admin/addvolunteer', methods=['POST'])
def addVolunteer():
    """
    Takes in a JSON of the structure {'email', 'classId'}

    Adds <email> to <classId> as a volunteer

    Returns {'success' : Boolean}
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.json is None or 'email' not in request.json or 'classId' not in request.json:
        abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    convClassId = ObjectId(request.json['classId'])

    # TODO: Validate types
    us = dbworker.getUser(str(email))
    cl = dbworker.getClass(convClassId)
    if us is None or cl is None:
        abort(404)

    if us['userType'] not in [dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor'], dbworker.userTypeMap['volunteer']]:
        # Allow non volunteers to volunteer
        # TODO: VALID?
        abort(400)

    return jsonify({'success' : dbworker.addVolunteer(convClassId, str(email))})


@app.route('/api/admin/removevolunteer', methods=['POST', 'DELETE'])
def removeVolunteer():
    """
    Takes in a JSON of the structure {'email', 'classId'}

    Removes <email> from <classId> as a volunteer

    Returns {'success' : Boolean}
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)


    if request.json is None or 'email' not in request.json or 'classId' not in request.json:
        abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    convClassId = ObjectId(request.json['classId'])

    # TODO: Validate types
    us = dbworker.getUser(str(email))
    cl = dbworker.getClass(convClassId)
    if us is None or cl is None:
        abort(404)

    if us['userType'] not in [dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor'], dbworker.userTypeMap['volunteer']]:
        # Allow non volunteers to be volunteers
        # TODO: VALID?
        abort(400)




    return jsonify({'success' : dbworker.removeVolunteer(convClassId, str(email))})


@app.route('/api/admin/createuser', methods=['POST'])
def createUser():
    """
    Takes in a JSON of the structure
    {
    "email": "test@admin.com",
    "password": "PLAINTEXT PASSWORD HERE",
    "userType": 1,
    "firstName": "Test",
    "lastName": "Admin",
    "phoneNumber": "555-555-5555",
    "birthday": "YYYY-MM-DD",
    "parentEmail" : "",
    "parentName" : ""
    }


    Returns {'success' : Boolean}
    """
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.json is None:
        abort(400)

    for x in ['email', 'password', 'userType', 'firstName', 'lastName', 'phoneNumber', 'birthday', 'parentEmail', 'parentName']:
        if x not in request.json:
            abort(400)

    email = mailsane.normalize(request.json['email'])
    if email.error:
        abort(400)

    # TODO: Verify no duplicate email here or in the dbworker method
    # likely better to do it there

    parentEmail = mailsane.normalize(request.json['parentEmail'])
    if parentEmail.error:
        abort(400)

    # TODO: Validate types
    dbworker.createUser(str(email), str(parentEmail), request.json['firstName'], request.json['lastName'], request.json['password'], request.json['userType'], request.json['phoneNumber'], datetime.datetime.strptime(request.json['birthday'], '%Y-%m-%d'), request.json['parentName'])

    return jsonify({'success' : True})

@app.route('/api/admin/uploadSpreadSheet', methods=['POST'])
def handleSpreadSheet():
    if not dbworker.validateAccess(dbworker.userTypeMap['admin']):
        abort(403)

    if request.files is None or 'file' not in request.files:
        abort(400)

    sheetFile = request.files['file']
    try:
        sheetHandler = spreadSheetHandler.SheetHandler(sheetFile)
        failures = sheetHandler.assignSpreadSheetUsers()
        return jsonify(failures)

    except XLRDError as e:
        abort(400)


# This may be a debug route, not sure, made by Steffy
@app.route('/api/getClasses/<email>', methods=['GET'])
@app.route('/getClasses/<email>', methods=['GET'])
def getUserClasses(email):
    if not dbworker.validateAccessList([dbworker.userTypeMap['admin'], dbworker.userTypeMap['instructor'], dbworker.userTypeMap['student']]):
        abort(403)

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

    dbworker.createUser(username + '@mcode.club', username + '@mcode.club', 'Sample', 'User', 'I love rock and roll', 1, '647-111-1111', datetime.datetime.strptime('1970-01-01', '%Y-%m-%d'), 'Parent Name')
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

@app.route('/deleteorphans')
def deleteOrphansDebug():
    # Delete orphans (orphaned by class, not by user)
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    dbworker.clearOrphanedReports()

    return jsonify({'success' : True})

@app.route('/testFile', methods=['POST'])
def handleSPreadSheetDebug():
    if request.files is None or 'file' not in request.files:
        abort(400)

    sheetFile = request.files['file']
    try:
        sheetHandler = spreadSheetHandler.SheetHandler(sheetFile)
        failures = sheetHandler.assignSpreadSheetUsers()
        return jsonify(failures)

    except XLRDError as e:
        abort(400)





# This blocks off routes like /a/.../.../.........
# This is used to allow the React app to have routes that won't throw a 404

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
