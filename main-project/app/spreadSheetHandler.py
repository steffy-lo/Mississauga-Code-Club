import pandas as pd
import datetime
import dbworker
import mailsane
import math
import sys


# request.files, files['file']

# /testFile

# List of the names of attribute needed to construct a student user
studentAttributes = ['MCC Account', 'Parent\'s Email', 'First Name', 'Last Name', 'Password', 'Phone Number',
                     'Birthdate', 'Parent\'s Name']


class SheetHandler:
    """An object that takes an MCC formatted excel file and extracts the necessary info from it"""


    def __init__(self, fileObject):
        # Dictionary to store the different tables in the spreadsheet
        self.tableDict = {'Students': {}, 'Course': {}, 'Instructors': {}}
        # Dictionary to store the failed entries
        self.failures = {'Students': {}, 'Instructors': {}, 'Helpers': {}, 'Invalid File Formats': {}}
        # The fullsheet expressed as a dictionary of Dataframes with the sheet names as keys
        self.fullSheet = pd.read_excel(fileObject, sheet_name=None)

        for sheetIndex in self.fullSheet:

            # Costructs a Dataframe of the course info from the given excel file
            courseTable = pd.read_excel(fileObject, sheet_name=sheetIndex, index_col=0, nrows=2, usecols="A,B",
                                        skiprows=[0], header=None)
            if list(courseTable.index) == ['Course Title', 'Schedule']:

                # Constructs a dictionary out of the Dataframe courseTable and adds it to the table dictionary
                self.tableDict['Course'][sheetIndex] = courseTable.to_dict('index')

            else:
                self.tableDict['Course'][sheetIndex] = {}

            # Constructs a Dataframe of the student info from the given excel file
            studentTable = pd.read_excel(fileObject, sheet_name=sheetIndex, header=5, parse_date=[2], usecols="A:H")

            if list(studentTable.columns) == [ 'First Name', 'Last Name', 'Birthdate', 'Parent\'s Email', 'Phone Number',
                                               'Parent\'s Name', 'MCC Account', 'Password']:
                # Constructs a dictionary out of the Dataframe studentTable and adds it to the table dictionary
                self.tableDict['Students'][sheetIndex] = studentTable.to_dict('index')

            else:
                self.tableDict['Students'][sheetIndex] = {}


            # Constructs a Dataframe of the instructor info from the given excel file
            instructorTable = pd.read_excel(fileObject, sheet_name=sheetIndex, header=5, usecols="J,K")

            if list(instructorTable.columns) == ['Instructor Account(s)', 'Helper Account(s)']:

                # Constructs a dictionary out of the Dataframe instructorTable and adds it to the table dictionary
                self.tableDict['Instructors'][sheetIndex] = instructorTable.to_dict('list')

            else:
                self.tableDict['Instructors'][sheetIndex] = {}


    def getStudentList(self, index):
        global studentAttributes

        studentList = []
        self.failures['Students'][index] = []

        # For each row in the dict
        for user in self.tableDict['Students'][index]:
            fail = False
            newUser = True
            thisStudentInfo = []
            email = ''

            # Check if there is a username column
            if 'MCC Account' in self.tableDict['Students'][index][user] and \
                not pd.isnull(self.tableDict['Students'][index][user]['MCC Account']):

                email = self.tableDict['Students'][index][user]['MCC Account']
                checkEmail = mailsane.normalize(email)
                if checkEmail.error:
                    self.failures['Students'][index].append('Error at email for student at row ' + str(user+1))
                    fail = True

                # Check if Account already exists
                elif dbworker.mclient[dbworker.database]['users'].find_one({'userType': dbworker.userTypeMap['student'],
                                                                          'email': email}) is not None:
                    newUser = False
                    studentList.append(email)

                # If account doesn't exist, extract the student info from the table
                else:
                    attributeIndex = 1
                    while attributeIndex < len(studentAttributes) and not fail:
                        if studentAttributes[attributeIndex] in self.tableDict['Students'][index][user] and \
                                not pd.isnull(self.tableDict['Students'][index][user][studentAttributes[attributeIndex]]):

                            thisStudentInfo.append(self.tableDict['Students'][index][user][studentAttributes[attributeIndex]])

                        else:
                            self.failures['Students'][index].append('Error at ' + studentAttributes[attributeIndex] +
                                                                    ' for student at row ' + str(user+1))
                            fail = True

                        attributeIndex += 1

            else:
                self.failures['Students'][index].append('Error at MCC Account for student at row ' + str(user+1))
                fail = True

            # If all the parameters are met, add user info to the database
            if (not fail) and newUser:
                dbworker.createUser(email, thisStudentInfo[0], thisStudentInfo[1], thisStudentInfo[2],
                                    thisStudentInfo[3], 4, thisStudentInfo[4], thisStudentInfo[5], thisStudentInfo[6])
                studentList.append(email)

        return studentList



    def getInstructorList(self, index):
        # Construct lists of instructors
        instructorList = []
        self.failures['Instructors'][index] = []
        for i in self.tableDict['Instructors'][index]['Instructor Account(s)']:
            if dbworker.mclient[dbworker.database]['users'].find_one({'userType': dbworker.userTypeMap['instructor'],
                                                                      'email': i}) is not None:
                instructorList.append(i)

            else:
                if not pd.isnull(i):
                    self.failures['Instructors'][index].append(i)

        return instructorList


    def getVolunteerList(self, index):
        """
        Construct a list of helpers
        :param index:
        :return:
        """
        volunteerList = []
        self.failures['Helpers'][index] = []
        for h in self.tableDict['Instructors'][index]['Helper Account(s)']:
            if dbworker.mclient[dbworker.database]['users'].find_one({'userType': dbworker.userTypeMap['volunteer'],
                                                                      'email': h}) is not None:
                volunteerList.append(h)
            else:
                if not pd.isnull(h):
                    self.failures['Helpers'][index].append(h)

        return volunteerList


    def assignSpreadSheetUsers(self):
        """
        Takes the info from each sheet in the table dictionary, instantiates a class, and populates said class with
        students and instructors.

        :return: The error dictionary with the keys Students, Instructors, Helpers, and Invalid File Formats
        """
        for sheetIndex in self.fullSheet:
            if 'Course Title' in self.tableDict['Course'][sheetIndex] and 'Schedule' in self.tableDict['Course'][sheetIndex]:
                if not pd.isnull(self.tableDict['Course'][sheetIndex]['Course Title'][1]) and \
                    not pd.isnull(self.tableDict['Course'][sheetIndex]['Schedule'][1]):
                    studentList = self.getStudentList(sheetIndex)

                    instructorList = self.getInstructorList(sheetIndex)

                    volunteerList = self.getVolunteerList(sheetIndex)

                    dbworker.createClass(self.tableDict['Course'][sheetIndex]['Course Title'][1], studentList, instructorList, volunteerList,
                                         self.tableDict['Course'][sheetIndex]['Schedule'][1])

                else:
                    self.failures['Invalid File Formats'][sheetIndex] = 'Error null values in class info table'
            else:
                self.failures['Invalid File Formats'][sheetIndex] = 'Error in class info table format'
                # self.failures['Invalid File Formats'][sheetIndex] = self.tableDict['Course'][sheetIndex]


        return self.failures