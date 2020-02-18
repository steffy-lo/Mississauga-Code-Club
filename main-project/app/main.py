from flask import Flask, jsonify, request, abort, session, redirect, url_for
from flask_cors import CORS
import os # TODO: May not be needed
import bcrypt
from pymongo import MongoClient

# Start the app and setup the static directory for the html, css, and js files.
app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)

# DO NOT SHOW THIS PUBLICLY. THIS SHOULD BE HIDDEN IF CODE
# IS MADE PUBLIC
app.secret_key = b'834914j1sdfsdf93jsdlghgsagasd'

def validateCredentials(username, password):
    # TODO: Return a boolean indicating if the password is valid
    return True

def getUserType(username):
    # TODO:
    return 0

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
    return str(bcrypt.gensalt())

@app.route('/forcelogin/<int:userid>')
def forcelogin(userid):
    # Used to test how the sessions work
    userid = str(userid)
    session['username'] = userid
    return redirect(url_for('index'))

@app.route('/checklogin')
def checklogin():
    if 'username' in session:
        return "Logged in as " + session['username']

    return "Not logged in"

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
