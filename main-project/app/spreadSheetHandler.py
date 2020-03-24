import pandas as pd
import datetime
import dbworker
from flask import Flask, jsonify


# request.form, form['file']

# /testfile

# Dictionary to store the different tables in the spreadsheet
tableDict = {}

# Ordered list of the names of attribute needed to construct a student user
studentAttributes = ['MCC Account', 'Parent\'s Email', 'First Name', 'Last Name', 'Password', 'Phone Number',
                     'Birthdate', 'Parent\'s Name']


def readSpreadSheetTable(fileObject, sheetIndex):

    global tableDict

    # Costructs a Dataframe of the course info from the given excel file
    courseTable = pd.read_excel(fileObject, sheet_name=sheetIndex, index_col=0, nrows=2)

    # Constructs a Dataframe of the student info from the given excel file
    studentTable = pd.read_excel(fileObject, sheet_name=sheetIndex, header=5, parse_date=[2], usecols="A:H")

    # Constructs a Dataframe of the instructor info from the given excel file
    instructorTable = pd.read_excel(fileObject, sheet_name=sheetIndex, header=5, usecols="J,K")

    # Constructs a dictionary out of the Dataframe studentTable and adds it to the table dictionary
    tableDict['Students'] = studentTable.to_dict('index')

    # Constructs a dictionary out of the Dataframe courseTable and adds it to the table dictionary
    tableDict['Course'] = courseTable.to_dict('index')

    # Constructs a dictionary out of the Dataframe instructorTable and adds it to the table dictionary
    tableDict['Instructors'] = instructorTable.to_dict('list')



def assignSpreadSheetUsers():
    global tableDict
    global studentAttributes

    failures = {}
    studentList = []

    # For each row in the dict
    for user in tableDict['Students']:
        fail = False
        newUser = True
        thisStudentInfo = []
        email = ''


        # Check if there is a username column
        if 'MCC Account' in user:
            email = tableDict['Students'][user]['MCC Account']

            #Check if Account already exists
            if dbworker.mclient[dbworker.database]['users'].find_one({'userType' : dbworker.userTypeMap['student'],
                                                                              'email' : email}) is not None:
                newUser = False
                studentList.append(email)

            # If account doesn't exist, extract the student info from the table
            else:
                attributeIndex = 1
                while attributeIndex < studentAttributes.size() and not fail:
                    if studentAttributes[attributeIndex] in user:
                        thisStudentInfo.append(tableDict['Students'][user][studentAttributes[attributeIndex]])
                    else:
                        failures[user] = tableDict['Students'][user]
                        fail = True

                    attributeIndex += 1

        else:
            failures[user] = tableDict['Students'][user]
            fail = True

        # If all the parameters are met, add user info to the database
        if (not fail) and newUser:
            dbworker.createUser(email, thisStudentInfo[0], thisStudentInfo[1], thisStudentInfo[2], thisStudentInfo[3],
                                4, thisStudentInfo[4], thisStudentInfo[5], thisStudentInfo[6])

    # Construct lists of instructors and helpers
    instructorList = []
    volunteerList = []
    failures['Instructors'] = []
    failures['Helpers'] = []
    for i in tableDict['Instructors']['Instructor Account(s)']:
        if dbworker.mclient[dbworker.database]['users'].find_one({'userType': dbworker.userTypeMap['instructor'],
                                                                  'email': i}) is not None:
            instructorList.append(i)

        else:
            failures['Instructors'].append(i)

    for h in tableDict['Instructors']['Helper Account(s)']:
        if dbworker.mclient[dbworker.database]['users'].find_one({'userType': dbworker.userTypeMap['volunteer'],
                                                                  'email': h}) is not None:
            volunteerList.append(h)
        else:
            failures['Helpers'].append(h)

    dbworker.createClass(tableDict['Course']['Course Title'], studentList, instructorList, volunteerList,
                         tableDict['Course']['Schedule'][1])

    return jsonify(failures)

# # Check if there is an age column
# if 'Age' in user and (not fail) and newUser:
#     age = tableDict['Students'][user]['Age']
#     birthYear = datetime.date.today().timetuple()[0] - age
#     birthDate = datetime.datetime(birthYear, 1, 1)
# elif fail is False:
#     failures[user] = tableDict['Students'][user]
#     fail = True