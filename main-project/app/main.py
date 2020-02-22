from flask import Flask, jsonify, request, abort, session, redirect, url_for
from flask_cors import CORS
import os
import bcrypt
from pymongo import MongoClient
import datetime

# Start the app and setup the static directory for the html, css, and js files.

# TODO: Get this working, maybe
STATIC_FOLDER = 'client/build'
# STATIC_FOLDER = 'static' # Default static folder to display warnings
# if os.path.exists('client/build'):
#     # React app was built
#     # Well, the folder exists at least, might as well try to serve it
#     STATIC_FOLDER = 'client/build'


app = Flask(__name__, static_url_path='', static_folder=STATIC_FOLDER)
CORS(app)

# DO NOT SHOW THESE CREDENTIALS PUBLICLY
DBUSER = "mccgamma"
DBPASSWORD = "alfdasdf83423j4lsdf8"
MONGOURI = "mongodb://" + DBUSER + ":" + DBPASSWORD + "@ds117535.mlab.com:17535/heroku_9tn7s7md?retryWrites=false"

mclient = MongoClient(MONGOURI)

database = 'heroku_9tn7s7md' # This is a database within a MongoDB instance

# DO NOT SHOW THIS PUBLICLY. THIS SHOULD BE HIDDEN IF CODE
# IS MADE PUBLIC
# THIS IS USED FOR THE SESSION COOKIE ENCRYPTION
app.secret_key = b'834914j1sdfsdf93jsdlghgsagasd'

# Turn this to False when properly deploying to make sure that all
# debugging routes are shut off.
ENABLE_DEBUG_ROUTES = True

def validateCredentials(username, password):
    # Return a boolean indicating if the password is valid
    user = mclient[database]['users'].find_one({'email' : username})
    if user is None:
        return False

    return bcrypt.hashpw(password.encode(), user['password']) == user['password']

def getUserType(username):
    # Returns None if there is no such user
    user = mclient[database]['users'].find_one({'email' : username})
    if user is None:
        return None

    return user['userType']

def validateAccess(expectedUserTypes):
    # Validate that the user is logged in, use the information in the
    # session data to determine if their username is valid and one of the
    # expectedUserTypes, return boolean, True if valid, False if invalid
    if session['userName'] is None:
        return False

    uType = getUserType(session['username'])

    for x in expectedUserTypes:
        if uType == x:
            return True

    return False

def createUser(email, parentEmail, firstName, lastName, password, userType, phoneNumber, age, parentName):
    salt = bcrypt.gensalt()
    password = password.encode()

    saltedPassword = bcrypt.hashpw(password, salt)
    mclient[database]['users'].insert_one({'email' : email, 'parentEmail' : parentEmail, 'firstName' : firstName, 'lastName' : lastName, 'password' : saltedPassword, 'userType' : userType, 'phoneNumber' : phoneNumber, 'age' : age, 'parentName' : parentName})

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/authenticate')
def authenticate():
    # Use this route to log in and get a token
    # Takes in a json of the form {username : '', password : ''}

    # TODO: Likely need to validate username is good input here

    if validateCredentials(request.json['username'], request.json['password']):
        userType = getUserType(request.json['username'])
        session[request.json['username']] = request.json['username']
        return jsonify({'userType' : userType, 'success' : True})

    abort(401)

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

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
    session['username'] = userid
    return redirect(url_for('index'))

@app.route('/checklogin')
def checklogin():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    if 'username' in session:
        return "Logged in as " + session['username']

    return "Not logged in"

@app.route('/addjunk')
def addjunk():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    mclient[database]['junk'].insert_one({"datetime" : datetime.datetime.now()})

    return "Junk added"

@app.route('/seejunk')
def seejunk():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    outString = ""
    for j in mclient[database]['junk'].find():
        outString += str(j) + " "

    return outString

@app.route('/clearjunk')
def clearjunk():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    mclient[database]['junk'].remove()
    return "Cleared!"

@app.route('/addsampleuser/<username>')
def addSampleUser(username):
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    createUser(username, username + '@roma.it', 'Sample', 'User', 'I love rock and roll', 0, '647-111-1111', 18, 'Parent Name')
    return username

@app.route('/showusers')
def showAllUsersDebug():
    if not ENABLE_DEBUG_ROUTES:
        abort(404)

    outString = ""
    for j in mclient[database]['users'].find():
        outString += str(j) + " "

    return outString

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
