from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import os

# Start the app and setup the static directory for the html, css, and js files.
app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)

def validateToken(username, token):
    # TODO: Return a boolean validating the token is active and associated with username
    return True

def validateCredentials(username, password):
    # TODO: Return a boolean indicating if the password is valid
    return True

def getToken(username):
    # TODO: Generate a new token for the username
    # if an existing token already exists, return that instead
    return None

def getUserType(username):
    # TODO:
    return 0

@app.route('/')
def hello_world():
    return app.send_static_file('index.html')

@app.route('/authenticate')
def authenticate():
    # Use this route to log in and get a token
    # Takes in a json of the form {username : '', password : ''}
    token = None
    success = False
    userType = 0 # Unused user type

    if validateCredentials(request.json['username'], request.json['password']):
        success = True
        token = getToken(request.json['username'])
        userType = getUserType(request.json['username'])

    
    return jsonify({'userType' : userType, 'success' : success, 'token' : token})

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
