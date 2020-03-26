import pandas as pd
import datetime
import dbworker
import mailsane


# request.form, form['file']

# /testFile

# Ordered list of the names of attribute needed to construct a student user
studentAttributes = ['MCC Account', 'Parent\'s Email', 'First Name', 'Last Name', 'Password', 'Phone Number',
                     'Birthdate', 'Parent\'s Name']


class SheetHandler:
    """An object that takes an MCC formatted excel file and extracts the necessary info from it"""


    def __init__(self, fileObject):
        # Dictionary to store the different tables in the spreadsheet
        self.tableDict = {'Students': {}, 'Course': {}, 'Instructors': {}}
        # Dictionary to store the failed entries
        self.failures = {'Students': {}, 'Instructors': {}, 'Helpers': {}}
        # The fullsheet expressed as a dictionary of Dataframes with the sheet names as keys
        self.fullSheet = pd.read_excel(fileObject, sheet_name=None)

        for sheetIndex in self.fullSheet:

            # Costructs a Dataframe of the course info from the given excel file
            courseTable = pd.read_excel(fileObject, sheet_name=sheetIndex, index_col=0, nrows=2)

            # Constructs a Dataframe of the student info from the given excel file
            studentTable = pd.read_excel(fileObject, sheet_name=sheetIndex, header=5, parse_date=[2], usecols="A:H")

            # Constructs a Dataframe of the instructor info from the given excel file
            instructorTable = pd.read_excel(fileObject, sheet_name=sheetIndex, header=5, usecols="J,K")

            # Constructs a dictionary out of the Dataframe studentTable and adds it to the table dictionary
            self.tableDict['Students'][sheetIndex] = studentTable.to_dict('index')

            # Constructs a dictionary out of the Dataframe courseTable and adds it to the table dictionary
            self.tableDict['Course'][sheetIndex] = courseTable.to_dict('index')

            # Constructs a dictionary out of the Dataframe instructorTable and adds it to the table dictionary
            self.tableDict['Instructors'][sheetIndex] = instructorTable.to_dict('list')


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
            if 'MCC Account' in self.tableDict['Students'][index][user]:
                email = self.tableDict['Students'][index][user]['MCC Account']
                checkEmail = mailsane.normalize(email)
                if checkEmail.error:
                    self.failures['Students'][index].append('Error at email for ' +
                                                            str(self.tableDict['Students'][index][user]))
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
                        if studentAttributes[attributeIndex] in self.tableDict['Students'][index][user]:
                            thisStudentInfo.append(self.tableDict['Students'][index][user][studentAttributes[attributeIndex]])
                        else:
                            self.failures['Students'][index].append('Error at ' + studentAttributes[attributeIndex] +
                                                                    ' for ' + str(self.tableDict['Students'][index][user]))
                            fail = True

                        attributeIndex += 1

            else:
                self.failures['Students'][index].append('Error at MCC Account for ' +
                                                            str(self.tableDict['Students'][index][user]))
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
                self.failures['Instructors'][index].append(i)

        return instructorList



    def getVolunteerList(self, index):
        # Construct lists of helpers
        volunteerList = []
        self.failures['Helpers'][index] = []
        for h in self.tableDict['Instructors'][index]['Helper Account(s)']:
            if dbworker.mclient[dbworker.database]['users'].find_one({'userType': dbworker.userTypeMap['volunteer'],
                                                                      'email': h}) is not None:
                volunteerList.append(h)
            else:
                self.failures['Helpers'][index].append(h)

        return volunteerList



    def assignSpreadSheetUsers(self):
        for sheetIndex in self.fullSheet:
            studentList = self.getStudentList(sheetIndex)

            instructorList = self.getInstructorList(sheetIndex)

            volunteerList = self.getVolunteerList(sheetIndex)

            dbworker.createClass(self.tableDict['Course'][sheetIndex]['Course Title']['Unnamed: 1'], studentList, instructorList, volunteerList,
                                 self.tableDict['Course'][sheetIndex]['Schedule']['Unnamed: 1'])

        return self.failures

# # Check if there is an age column
# if 'Age' in user and (not fail) and newUser:
#     age = tableDict['Students'][user]['Age']
#     birthYear = datetime.date.today().timetuple()[0] - age
#     birthDate = datetime.datetime(birthYear, 1, 1)
# elif fail is False:
#     failures[user] = tableDict['Students'][user]
#     fail = True