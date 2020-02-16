from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import os

# Start the app and setup the static directory for the html, css, and js files.
app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)

def validateToken(username, token):
    # TODO: Return a boolean validating the token is active and associated with username
    return True

def generateToken(username):
    # TODO: Generate a new token for the username
    pass


@app.route('/')
def hello_world():
    return app.send_static_file('index.html')

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
