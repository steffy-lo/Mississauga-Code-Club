

# DO NOT SHOW THIS PUBLICLY. THIS SHOULD BE HIDDEN IF CODE
# IS MADE PUBLIC
# THIS IS USED FOR THE SESSION COOKIE ENCRYPTION
SECRET_KEY = b'834914j1sdfsdf93jsdlghgsagasd'

STATIC_FOLDER = 'client/build'

# Turn this to False when properly deploying to make sure that all
# debugging routes are shut off.
ENABLE_DEBUG_ROUTES = False

# Database related configuration
# DO NOT SHOW THESE CREDENTIALS PUBLICLY
DBUSER = "USERNAME"
DBPASSWORD = "PASSWORD"
MONGOURI = "mongodb://" + DBUSER + ":" + DBPASSWORD + "@URL-FILLTHISIN?retryWrites=false"

DATABASE = 'DATABASE-FILLTHISIN' # This is a database within a MongoDB instance





if __name__ == "__main__":
    print("This file is not designed to be executed directly.")
