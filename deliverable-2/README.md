# MISSISSAUGA CODE CLUB  

## Description

Our web application provides Mississauga Code Club (MCC) a portal to manage its employees, volunteers, and students more effectively and efficiently. This ranges from providing an easy way for instructors to provide performance reports for students and parents to view, to giving administrators a simplified way to track work hours of their staff members. Overall, our web application will provide MCC a modernized management system to smooth their workflow, and the resulting boost in productivity will help MCC achieve its mission of helping kids and youth become technology innovators and creators.

With this web application, we are combating the disorganization within MCC’s current management system. MCC has historically used analog methods for almost all administration, such as creating student progress reports, and volunteer/instructor time auditing; there is currently no digital method of tracking work hours or providing progress reports to parents and students. As everything is done analog by hand, the labour required has been taking time away from more productive pursuits at MCC. Our web application aims to provide a single platform to automate and improve some of their current processes.


## Key Features

There are key features implemented for each role. The current implemented roles are:

#### Administrators

-   View and edit staff, volunteer and teacher accounts, including their related data
    - This allows for easy access to staff information and ensures all changes are universal. This helps solve the book keeping issues MCC has had with their earlier analog methods.  

-   View and edit courses
    - Similar to the staff information, our app supports quick universal changes across the database. An Administrator can change a course’s name, toggle its Active/Inactive status, and add teachers and students.

-   Add accounts manually
    - Unlike the excel spreadsheets MCC was relying on earlier, the app provides an organized form for each manual addition of a user, which will then be updated in the database.  

-   Add courses, in a similar fashion to adding accounts  
    - As with the accounts feature, this provides a much easier route to adding and organizing courses than spreadsheets.
-   Log in Teaching and Volunteer Hours
    - Administrators can now easily enter and update hours for their volunteers. This is a great improvement from the spreadsheet bookkeeping they were reliant upon before.

#### Students

-   Track their performance
    - Students now have direct access to view their grades across all completed courses at any given time. This cuts out the step of requesting a report from a teacher or administrator.  

-   View all courses taken or in-progress
    -  Students can easily keep track of the courses they’ve taken and are in the process of taking.  

-   View course recommendations  
    - Students can now view upcoming courses based on the courses they are currently undertaking.  


## Instructions
An end-user can access the web application at this link: https://mcc-deliverable-2.herokuapp.com/

* So where do you start?  

We have set up pre-created dummy credentials for the Student and Administrator roles.

**Administrator**:
Email: test@admin.com  
Password: password

**Student**:
Email: test@student.com  
Password: password

Inputting either of these credentials will take an end-user to their respective dashboards. At the login screen, a user enters a valid MCC email and password. According to MCC, these will be provided to them by an administrator through some means outside the scope of our app.


#### Administrator Features Guide

-   **View and edit staff, volunteer and teacher accounts**  

1) In the Admin home page, navigate to the section labelled “Manage Users and Data”  
2) A new page should load up with the header “Select a User”. The instructions below the header provide the necessary guidance:  “Click on a user to view and edit their information”.  The users will be organized into a 3 columned table with the headers “Email”, “First Name”, and “Last Name” going from left to right.
3) From this page, navigate to the relevant user entry in the table and select them  
4) A new page should load up with the header “Edit User” above a filled user form. Each text field can be edited save for the email and User Type
5) When all edits have been completed, select the button on the bottom left of the form “Save Changes”. If successful, a pop-up will inform that the changes were saved to that user account.  

-  **View and edit courses**
1) In the Admin home page, navigate to the section labelled “Manage Classes”
2) A new page should load up with the header “Select a Class”, followed by a list of class titles. Above the header are tabs for “Ongoing” and “Completed” classes. Both of these tabs house their own list of class titles. Select from this list the class that should be accessed.
3) Once the class has been selected, a new page should load with the header “Edit Class”. Below is a form with all of the class’s information, including its Title, Grading Criteria, lists of teacher and student emails respectively, and Active/Inactive status.
4) To add a teacher or a student, enter a valid teacher/student email into the empty field provided at the bottom of each list. After the email is filled in, select the Add Teacher/Student button to the right of the field. If the email is valid, it should then be immediately added to the desired roster. If not, a pop up will inform that the email does not match any in the database.
5) To change the class’s active status, navigate to the Active and Inactive toggle fields to the left of the form. Select the circle beside whichever status that is not highlighted. This circle should now be highlighted while the other one is unhighlighted. Select the button to the right of the field labelled “Save Details” to ensure these changes persist. To check that the status does indeed persist, refer to step (1) to view the list of classes. If the class is Active it should be in the list for “Ongoing Classes”, and if it’s Inactive it should be in “Completed Classes”.
6) To change the class title, edit the text field to the right of the sudheader “Class Title” on the left of the form. When the new title has been successfully filled in, select the button to the right of the field labelled “Save Details”. This ensures that the title persists past the edit screen. To check that the title does indeed persist, refer to step (1) to view it in the list of classes.

-   **Add accounts manually**  

1) To add accounts manually, in the Admin home page, navigate to the section labelled “Create New Users”
2) A new page should load up with the header “Create New User”. Along with it should be an empty form with prompts to input the relevant information attached to the new user.
3) Fill in all fields except Birthday and Parent Name/Email if the new user is any User Type other than “Student”. Their User Type is also subject to change at the top right hand corner of the form. It’s default is Student.
4) When all necessary information has been filled in, select “Create New User” at the bottom left corner of the form. If all required fields have been filled, a pop-up will appear on the screen informing that the user was successfully added. To check, refer to steps (1-2) of the  **View and edit staff, volunteer and teacher account** guide.  

-   **Add courses, in a similar fashion to adding accounts**

1) From the Administrator dashboard, click “Create New Classes”
2) Enter your desired name for the course and click OK.
3) To check if the course was added, refer to steps (1-2) of the **View and edit courses** guide.
	-   **Log Teaching or Volunteer Hours**
1)From the Administrator dashboard, click “Check-In Page”.
2)Enter the email associated with the account one wants to log hours with.
3)Under **Type of Work**, choose between the **Teaching** or **Volunteering** toggles.
4)Under **Details**, input a message and the amount of hours one wishes to log.
5)Click **Check-in** to confirm your submission; a pop-up should appear confirming the changes.

#### Student Features Guide

-   **Track their performance**
1) From the Student Homepage/Dashboard, navigate to any of the listed courses under the header “Completed Courses”. Under the relevant course’s name, select the button labelled “View Grades”.
2) A new page should load up. To the left from top to bottom is the current course title dropdown, a list of grades for the course, teacher comments, and “Next Steps”. The header “Next Steps” contains a list of course recommendations for a student who has completed the selected course.
3) To navigate to a new course, select the dropdown at the top of the screen and select the new course title to access its report.

-   **View all courses taken or in-progress**
1) On the Student Homepage, on the left is a list of ongoing courses under the header “Enrolled Courses”. On the right is a list of completed courses under the header “Completed Courses”.  

-   **View course recommendations**  
Refer to steps (1-2) of the **Track their Performance** feature guide.

## Development requirements

* Technical requirements  

For frontend development, any working Internet browser with a functioning Javascript engine is required (meaning a mainstream web browser released in the last 20 years). For backend development, they will require Heroku CLI, Node.JS, Python, Docker, sh, and Make to build and deploy the application.

Python Libraries  
- from flask import Flask, jsonify, request, abort, session, redirect, url_for, escape  
- from flask_cors import CORS  
- os  
- bcrypt  
- from pymongo import MongoClient  
- from jsonschema import validate  
- datetime  
- dbworker  (custom, by us)
- mailsane  (custom, by us, uses email-validator)
- from schemaprovider import SchemaFactory  (custom, by us)

**Deployment Instructions**
- Import all necessary dependencies (listed above)
- Login with Heroku CLI
- Navigate to the Makefile and change the app name to “mcc-deliverable-2”
- Lastly, run the command line “make prod”


## Deployment and Github Workflow  

We elected not to use pull requests at the start of the project to increase the speed of development. We instead handle merging manually, using branches for each user and feature. Merging is handled by the person who wishes to push their code to master.  

We elected that if issues began to arise, that we would begin using pull requests for changes, however we did not run into any issues.  

Deployment is done manually through a Makefile, with both a development and production Heroku set up.

The code for this deliverable can be accessed in the branch deliverable-2-branch

## Licenses

We have chosen the MIT License for this project. It allows any party obtaining our code to do with it as they see fit. This may include publishing, modifying, and distributing the software. As the authors, we are not held liable to any claim or damages that arise from use of our code.  

We chose this license as it allows MCC free rein to work with and further improve on our codebase after the project is finished. They can outsource to any other group to make changes should they choose to. It also frees us of responsibility for the code after its completion.
