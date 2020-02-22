import bcrypt
import datetime
from pymongo import MongoClient

# DO NOT SHOW THESE CREDENTIALS PUBLICLY
DBUSER = "mccgamma"
DBPASSWORD = "alfdasdf83423j4lsdf8"
MONGOURI = "mongodb://" + DBUSER + ":" + DBPASSWORD + "@ds117535.mlab.com:17535/heroku_9tn7s7md?retryWrites=false"

mclient = MongoClient(MONGOURI)

database = 'heroku_9tn7s7md' # This is a database within a MongoDB instance

def getUser(username):
    return mclient[database]['users'].find_one({'email' : username})

def validateCredentials(username, password):
    # Return a boolean indicating if the password is valid
    user = getUser(username)
    if user is None:
        return False

    return bcrypt.hashpw(password.encode(), user['password']) == user['password']


def getUserType(username):
    # Returns None if there is no such user
    user = getUser(username)
    if user is None:
        return None

    return user['userType']

def validateAccessList(expectedUserTypes):
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

def validateAccess(expectedUserType):
    return validateAccessList([expectedUserType])

def createUser(email, parentEmail, firstName, lastName, password, userType, phoneNumber, age, parentName):
    salt = bcrypt.gensalt()
    password = password.encode()

    saltedPassword = bcrypt.hashpw(password, salt)
    mclient[database]['users'].insert_one({'email' : email, 'parentEmail' : parentEmail, 'firstName' : firstName, 'lastName' : lastName, 'password' : saltedPassword, 'userType' : userType, 'phoneNumber' : phoneNumber, 'age' : age, 'parentName' : parentName})

def setPassword(email, newPassword):
    """
    Used for updating a password for an existing user
    Matches based off the email, not the parentEmail
    Assumes that the user already exists (you should peform this check)
    """
    salt = bcrypt.gensalt()
    password = newPassword.encode()

    saltedPassword = bcrypt.hashpw(password, salt)
    mclient[database]['users'].update_one({'email' : email}, {'$set' : {'password' : saltedPassword}})

if __name__ == "__main__":
    print("This file should not be executed directly.")
