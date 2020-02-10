# Mississauga Code Club
> _Note:_ This document is meant to evolve throughout the planning phase of your project.   That is, it makes sense for you to commit regularly to this file while working on the project (especially edits/additions/deletions to the _Highlights_ section). Most importantly, it is a reflection of all the planning you work you've done in the first iteration.
 > **This document will serve as a master plan between your team, your partner and your TA.**

## Product Details

#### Q1: What are you planning to build?
A web application that helps Mississauga Code Club (MCC) manage its employees, volunteers, and staff, while also providing parents and students with a way to track their progress at MCC. At MCC, there has historically been no digital method of time tracking and providing progress reports to parents and students. This web application aims to modernize the management system at MCC, improving productivity and efficiency to help achieve the organization's mission of helping kids and youth become technology innovators and creators.

Essentially, this web application will be a dashboard for everyone involved with MCC. 

In particular, there will be different account types associated with the different user groups. The functionality and feature for each account type are as follows:
 ###### Administrators
 * View and edit staff, volunteer and teacher accounts, including their related data
 * Supervise and execute the clocking in of staff hours
 * Add accounts, manually or by importing from a document
 * Add courses, in a similar fashion to adding accounts
 * Generate reports for various things, including:
    * Hours worked by volunteers, staff, and instructors
    * Students' performance in a course
 
 ###### Instructors
* Clock-in their hours by collaborating with an administrator and view/browse them by date
* Input performance data for each of their students in each of the courses they are teaching and suggest follow-up courses
* Track students' performance weekly

 ###### Volunteers
 * Clock-in their hours by collaborating with an administrator
 * View and browse my volunteer hours by date
 
 ###### Parents
* Track their child(ren)'s performance
* View all courses taken or in-progress
* View course recommendations for their child(ren)

#### Q2: Who are your target users?

Our target users are mainly directed towards people involved in the Mississauga Code Club. However, it could potentially reach out to other organizations that want a small scale solution for a similar problem with their management system. Users will mostly be separated into a few to several different groups, including teachers, students, parents, volunteers and other staff.  
Teachers: passionate about teaching young children technology  
Students: children aged 8-18 interested in learning coding, digital media, and robotics  
Parents: caring and interested in their children’s activities  
Volunteers: loves technology and helping people  

##### Misdirected Mary (Administrator):
Mary works at MCC and is in charge of keeping track of the attendance of other staff and volunteers. Mary, however, has many other duties to perform while she is at work and cannot constantly keep track of the attendance/hours log. Unfortunately, it is not uncommon for people to make mistakes when filling out their attendance or, worse, for the sheet to end up misplaced, and, seeing as Mary is responsible for the log at the end of the day, she ends up having to spend valuable time following up. A log that could not be misplaced and contained only information that was valid, easily editable by her, would reduce the amount of follow-up necessary.

##### Ambitious Andy:
Andy is in charge of the internal processing of students that have signed up for courses, as well as the introduction of new course offerings. Andy is known for always working on a new course, whenever reasonable. He knows better than anyone, however, that the processing of students is particularly time consuming, as the students must be added manually, one-by-one, from a relevant spreadsheet. Were Andy able to simply import the entire spreadsheet, he could save time that could instead be put to thinking of ways to expand his course offering.

##### Tim the Teacher:
Tim is in charge of teaching multiple classes at the Mississauga Code Club and, as such, needs to keep track of his students' performance and, at the end of the course, write up a performance report for each of them, which his students then take home. Due to the volume of students, it is often necessary to carry around a large volume of varying sheets, some of which sometimes end up misplaced or mixed up with other such documents. Were Tim able to send out all of his reports directly to his students' parents without the need for extra loose documents, this would certainly improve his organisation and reduce his time spent on sorting reports.

##### Victor the Volunteer:
Victor is a high-school student in his final year, in need of his forty hours of community service, as well as several more for a scholarship that he is interested in. Ideally, Victor would like to commit to 15 hours per month, so that he could make the deadline well in advance, but, unfortunately, he struggles with keeping track of it all and this affects all of his other commitments. Being able to check his total volunteer hours would ease his scheduling troubles, not to mention his stress.

##### Pauline the Parent:
Pauline is the parent of a young child, Patrick, attending classes at the Mississauga Code Club. She is keenly interested in how Patrick is doing and wants recommendations on what to take next. However, Patrick has lost performance reports before and meeting with his instructors proves difficult, due to Pauline's job. The ability to see feedback (performance and recommendations) from the instructor online, would make this easier for her.

#### Q3: Why would your users choose your product? What are they using today to solve their problem/need?
##### Benefits
The current system for time tracking is done entirely on paper, requiring large amounts of physical record keeping as well as manual searching in order to confirm the amount of hours a volunteer or staff member has worked. By utilizing this app, Mississauga Code Club staff will be able to easily generate reports directly from their own accurate data that can be stored efficiently on a computer.

At the same time, their target users will be able to be tracked efficiently in one, centralized system, as opposed to being tracked through numerous, separate spreadsheets. This ensures that when a parent wants to know what courses their child has completed, the staff of Mississauga Code Club can easily and automatically answer the question, as well as provide recommendations for future courses for their child’s education. Before this solution, this required the staff of Mississauga Code Club to search numerous spreadsheets to find the information on one specific child.

This specific application may exist in the form of school administration software, designed for large schools with potentially large budgets for staff as well as technical resources. By providing this specific application, we bypass the need for large amounts of resources to achieve a targeted solution for Mississauga Code Club’s needs.

Overall, implementing this solution will enable Mississauga Code Club to better prepare young children and adults for a changing world which increasingly focuses on technology to solve emerging and existing issues.


#### Q4: How will you build it?

##### Technology Used:
###### Front-end: 
Languages: JavaScript, HTML, CSS
Framework: ReactJS
###### Back-End:
Language: Python
Framework: Flask
Database: MongoDB

##### Deployment:
###### Demo:
Heroku
###### Final:
Deployment instructions provided, likely on a subdomain of MCC's website

##### Third Party applications:
Docker, used to handle containers for deployment

##### Testing Strategy:

###### Front-end - ReactJS:  
* Write unit tests for React components using React’s built-in TestUtils module.
* Find users to perform specific tasks in the application (ie: login to an account to check weekly schedule of courses). Record findings, discuss required improvements and successes and create/refine team tasks. 
* Inspect presentation and functionality of application views on the latest versions of modern web browsers Chrome and Firefox.

 ###### Back-end - Python (with Flask framework):
* Write unit tests using the pytest framework to test request/response communications with the front-end and data endpoints. 

###### Code Integration:
* Performed manually as well as using automated tools like Selenium to see if behavior matches what is expected. In both cases, we will develop test cases that reflect expected issues.

#### Q5: What are the user stories that make up the MVP?
1. As the parent of a student at MCC, I want to be able to see a list of all courses my child has taken there, in order to track their progress.  
Acceptance Criteria:
	- View list of courses my child has completed
	- Record all courses that a student have taken
	- Only be able to see data that is relevant to my child
	- The courses are displayed in a readable format

2. As the parent of a student at MCC, I want to be able to see my child's performance in each of their courses, so I can see if they need assistance.  
Acceptance Criteria:
	- Parents can see the child's grades for each course
	- Performance will be viewed and tracked based on each course
	- Only be able to see their data relevant to the child.
	- Grades are displayed in an organized format

3. As the parent of a student at MCC, I want to see a list of recommended courses based on my child’s performance, in order to know what my child should focus on next.  
Acceptance Criteria:
	- Parents can see recommended courses
	- Recommended courses are updated as the child's education progresses
	- Recommended courses are based on performance on specific related courses
              
4. As a volunteer at MCC, I want to be able to see the number of volunteer hours I have logged between the span of any two dates in order to keep track of how many volunteer hours I have acquired.  
Acceptance Criteria:
	- Only display the number of hours logged between the two requested dates
	- Be able to select any two dates to view
	- Hours are viewed between two dates

5. As a volunteer at MCC, I want to be able to log my attendance to assigned hours, in order for MCC to have a record of my volunteer hours.  
Acceptance Criteria:
    -    Be able to confirm attendance for a specific day
          -    Keep an organized record of logged hours for other staff to review
    -    Only be able to log attendance to assigned hours

6. As a teacher, I want to be able to view the courses I am teaching, in order to accurately plan course material.  
Acceptance Criteria:
    -    Display only the courses that are currently being taught by the user
          -    Courses are displayed in a readable format
    -    Only courses that are being taught by the user can be viewed

7. As a teacher, I want to be able to provide feedback to each student in the form of grades and comments, in order to provide parents and students with their performance in the course.  
Acceptance Criteria:
    -    For each student in a course, be able to input grades
          -    For each student in a course, be able to provide feedback
    -    Only be able to insert grades and feedback for students currently being taught
    -    Be able to see a list of students enrolled in the course

8. As a teacher, I want to be able to provide course recommendations based on courses students have completed, in order to guide students toward further learning.  
Acceptance Criteria:
    -    For each student in a course, be able to provide suggested courses   
    -    The suggestions must be sent to the student in a readable format
    -    Only be able to suggest courses for students that completed the course with the teacher
    -    Be able to see a list of relevant students

9. As an administrator, I want to be able to access any specific user’s relevant info for MCC so that I can effectively manage their activities.  
Acceptance Criteria:
	- Each user and their associated information must be recorded and accessible Information is displayed in a readable format
	- Only relevant data is displayed

10. As an administrator, I want to be able to verify a volunteer’s logged hours, in order for MCC to have an accurate record of volunteer hours.  
Acceptance Criteria:
	- The total hours of a volunteer should be easily accessed
	- Logged hours from volunteers should be accessible from the admin side

11. As an administrator, I want to be able to generate a report at the request of a volunteer in order to allow them to showcase the work they have put into MCC for their supervisor.  
Acceptance Criteria:
	- Generate reports that shows the work hours of a volunteer at MCC
	- Reports should have a good format for readability purposes
	- Reports are per-person(volunteer) basis

12. As an administrator, I want to be able to add an account as any role, in order to populate the system with users.  
Acceptance Criteria:
	- Administrators are able to modify the database by adding accounts
	- Administrators are able to set the type (role) of the account
	- Users are added through the admin

13. As an administrator, I want to be able to remove any account, in order to keep my database organized with active users only.  
Acceptance Criteria:
	- Administrators are able to modify the database by removing accounts
	- Users are removed through the admin
	- Administrators can see which users are inactive
14. As an administrator, I want to be able to add or remove courses, in order to keep the course offerings up to date.  
Acceptance Criteria:
     -    Administrators can add any course to the database
     -    Administrators can remove any existing course
     -    Administrators can easily select from available courses to remove
     -    Only existing courses can be removed
     -    Cannot add a course if it already exists
     -    New courses can be added easily  

15. As any user, I want to be able to recover my password, in order to retrieve my account in case I forget my password.  
Acceptance Criteria:
	- Any user must be able to contact an admin to request a new password
	- When the new password is generated, the user is notified as soon as possible and can easily retrieve it

16. As an administrator, I want to be able to receive requests from users to generate a new password in order to ensure all users can access the necessary information.  
Acceptance Criteria:
	- Administrators can receive requests from users 
	- Administrators can easily view all unread requests
	- Administrators can delete requests whenever they wish

17. As an administrator, I want to be able to edit account profiles, in order to fix any errors generated by user input.  
Acceptance Criteria:
	- Administrators can access user account info
	- Administrators can select and edit user profiles
	- Administrators can easily inform the user in question that their account has been changed

18. As an administrator, I want to be able to assign an instructor to a course, in order to have a record of which instructor is teaching each course.  
Acceptance Criteria:
	- Administrators can access course pages to view course info (Instructors, students, etc.)
	- Administrators can assign an instructor to a course
	- Instructor’s are informed that they have been added to a course with all information required.
   
----

## Process Details

#### Q6: What are the roles & responsibilities on the team?

##### Roles:

###### Partner Liaison:
__Description__: Serves as a communication channel between the project partner and team members. Is responsible for initiating regular communications with the partner and relaying important discussion points to the rest of the team. Informs the partner about the project’s progress, including details regarding milestone’s, expected task completions, setbacks encountered.

###### Project Manager:
__Description__: The Project Manager is to make final decisions when the team cannot come to an agreement on a way forward. They also can reassign work if tasks will not be completed in time.

###### Operations Developer:
__Description__: Is responsible for creating/maintaining a reliable process for the effective/timely integration of new features into the existing codebase. 

###### Group Meetings Moderator:
__Description__: Is responsible for ensuring that weekly team meetings are productive, that important topics are addressed and work is assigned as required.

###### Full Stack Developer:
__Description__: Is responsible for evaluating and devising technical solutions that meet end-user requirements as defined. This will involve implementing and testing solutions on both fronts of the application. Should engage in constructive peer code review sessions with other team members, and be up-to-date with the evolving codebase. 

---
List each team member and:
 * A description of their role(s) and responsibilities including the components they'll work on and non-software related work
 * 3 technical strengths and weaknesses each (e.g. languages, frameworks, libraries, development methodologies, etc.)

##### Andriyan Bilyk
###### Role: Full Stack Developer
__Stengths__:
* Familiar with front-end web development, particularly in JS (and HTML & CSS) and ReactJS, and with back-end web development, particularly in NodeJS.
* Fair amount of experience working on web development projects (working for a non-profit and CSC309) & on coding projects in general, including group projects.
* Fairly adaptable/flexible and able to learn new tech (e.g. libraries) fairly quickly, if need be.

__Weaknesses__:
* Vulnerable to accidentally introducing feature creep (while developing, rather than planning).
* Does not always test code thoroughly on the first run.
* Documentation quality can be inadequate (particularly, when under time-pressure)
##### Edwin Chan
###### Role: Partner Liaison, Group Meeting Moderator
__Strengths__:
* Familiar with front-end development and designing user interfaces
* Extensive experience in the languages we have chosen for the project (Python, JS, CSS)
* Thorough in documentation

__Weaknesses__:
* Not much experience in database design
* Very little back-end development experience (limited to CSC309)
* Inaccurate time estimates of tasks

##### Nathan Fischer
###### Role: Partner Liaison, Designated Project Manager
__Strengths__:
* Professional full stack web development and communication experience
* Has taken most practical programming courses offered by the department
* Knows Python, JavaScript

__Weaknesses__:
* Has never done major web development work with Flask/Python
* Shy at in person meetings

##### Steffy Lo
###### Role: Full Stack Developer
__Strengths__:
* Main programming languages: Java, Python, C/C#
* A lot of experience with completing projects in general (from personal projects and hackathons)
* Strong in object-oriented programming
* Experience with database design

__Weaknesses__:
* Not a lot of experience with JS, HTML & CSS and other web frameworks

##### Phillip Smith
###### Role: Full Stack Developer
__Strengths__:
* Experience in Python, Java, C, C#, and C++ (Purely through UofT Computer Science Program)
* Works well with people (Has participated in multiple successful group projects)
* Tenacious when completing tasks

__Weaknesses__:
* Has a tendency to overthink problems 
* Has no web development experience prior to this class
* Finds difficulty in moving on from issues to revisit them later when working alone.

##### Dragan Soso
###### Role: Full Stack Developer, Group Meeting Moderator

__Strengths__:
* Experience with Python, Java, C, CSS, JS, React, HTML, UX, SQL, MongoDB
* Patient, team player, communicative

__Weaknesses__:
* Can get tunnel vision when searching for a solution to a problem 
* At times can over-engineer a solution, should instead opt for a simpler approach
* Needs improvement with task prioritization 




##### Ari Truanovsky
###### Role: Full Stack Developer
__Strengths__: 
* Experience with Python, Java, C, SQL
* Patient, works well with most people
* Generally writes clean, well-documented code  

__Weaknesses__:
* Not much web development experience
* No professional experience
* Can sometimes find difficulty with asking for help

#### Q7: What operational events will you have as a team?

Describe meetings (and other events) you are planning to have.
 * When and where? Recurring or ad hoc? In-person or online?
 * What's the purpose of each meeting?
 * Other events could be coding sessions, code reviews, quick weekly sync meeting online, etc.
 * You must have at least 2 meetings with your project partner (if you have one). Describe them here:
 30 minute phone call
   * What did you discuss during the meetings?
   * What were the outcomes of each meeting?
   * You must provide meeting minutes.
   * You must have a regular meeting schedule established by the second meeting.  

__Meeting Schedule__:
_Internal (Group)_:\
Normally, these will be online (through Discord) & ad-hoc (due to our chosen means of communication), through which in-person internal group meetings can be scheduled. Tentative schedule for in-person meetings is every Thursday 11am-1pm.  
Purpose:  
i) To plan other more important meetings in the future  
ii) To discuss more serious issues that could not be or hard to be resolved without a meeting (i.e. could not be resolved through standard text communication)  
iii) Coordinate each of our parts together through code reviews, so that each member will understand where the product is going as a whole  
iv) Monitor our individual progress and adjust when the need arises (e.g., if someone is struggling with a higher than expected workload, someone is finding themselves idle and finishing their part too fast)

_With Partner_:  
These have been agreed upon to take place biweekly on Tuesdays and will be “online”, by means of phone or video chat (however, those the group should all be in one place, in person). Physical meetings with the partner to happen as needed to demonstrate functionality of the MVP.

Purpose:  
i) To report progress made to our partner.  
ii) To ask for further clarifications.  
iii) To collect feedback on what is currently present.  
iv) To schedule an in-person meeting, where necessary.  

__Meetings with Partner__:
1. 30 minute phone call:  
_Topics of Discussion_:  
Initial introductions, finalizing web app vs phone app, understanding the high level use cases the partner is trying to solve
_Outcome_:  
Determined that the partner wished to meet in person, successfully identified basic users/use cases, partner committed to final decision on web app vs mobile app for next meeting  
_Meeting Minutes_:  

| Agenda Items | Time Alloted (min) |
| --- | --- |
| Introductions | 5 |
| Expectations going forward | 5 |
| Finalizing product idea | 20 |


2. 50 minute in-person meeting:  
_Topics of Discussion_:  
Scheduling recurring meeting, examining paper prototype mockups of the app as provided by the partner, answering final questions and better understanding the needs of the partner  
_Outcome_:  
Received mockups as well as commitment by the partner to send more mockups in following days, confirmed that the app would be a web app, confirmed true needs regarding document generation and inputting data, team plans to send draft of deliverable 1 prior to or at submission time for partner review to attempt to identify glaring issues. Established regular biweekly meetings, Tuesday 1-2pm  
_Meeting Minutes_:  

| Agenda Items | Time Allotted (min) |
| --- | --- |
| Establish regular meetings with partner| 5 |
| Discuss and review mockups| 30 |
| Analyzing the problem statement in-depth |  10 |
| Final wrap-up questions | 5 |


#### Q8: What artifacts will you use to self-organize?    
   * How do you keep track of what needs to get done?  
   
   GitHub issues will be used to keep track of what needs to be done.
   * How do you prioritize tasks?  
   
   Task prioritisation will be handled using labels on GitHub issues to provide various information about tasks, including their status and that of	their priority (e.g: "high", "normal", "low", etc. priority).
   * How do tasks get assigned to team members?  
   
   Task allocation will be primarily done by skill/experience (i.e. those more experienced with some type of work will likely 	 receive that variety of work).
   For contests of skill/experience, the parties involved have the option to work it out (if not, then by default, it would 	go to the party with the best compromise between a low workload and a lot of available time for the project).
   Finally, tasks which feature work that no-one on in the group has experience with will be assigned last and will be either 		taken by bid and consensus or by default assignment.
   * How do you determine the status of work from inception to completion?  
    
   The progression of a task will be tracked by labels on issues in GitHub and will be accompanied with associated discussion.

#### Q9: What are the rules regarding how your team works?
**Communications:**
 * What is the expected frequency? What methods/channels are appropriate?

All non-personal (i.e. group) communication is done through Discord, on an as-necessary basis. As such communication frequency will vary, but will effectively always be daily if not more frequent.

 * If you have a partner project, what is your process (in detail) for communicating with your partner?

There have been several ways established to communicate with the project partner. 
For non-severe issues that pop-up between meetings, email is suitable (however, this is primarily done through our two communication liasons, Nathan and Edwin). 
There is also a regular online/by-phone meeting scheduled biweekly, Tuesdays 1-2pm, where the group will physically come together and discuss matters through with the partner. The group members will assemble on campus to call the partner.

**Meetings:**
 * How are people held accountable for attending meetings, completing action items? Is there a moderator or process?


Nathan has been designated the Project Manager will hold the final say in redistributing the work if action items are failing to be completed. Dragan and Edwin are designated as Moderators for our weekly scrum like meeting.


**Conflict Resolution:**
 * List at least three team scenarios/conflicts you discussed in lecture and how you decided you will resolve them. Indecisions? Non-responsive team members? Any other scenarios you can think of?

In order to avoid general conflicts with regards to team expectations, we have put out a preventive measure, which is to communicate proactively on our communication channel about any delays we may have with our assigned tasks, as to prevent any surprises where a team member has done minimal work on their assigned task by the deadline.

 **_Team member not getting work done on set time_**: In this case, the team will assign available members to aid others in the tasks they have yet to complete.

**_Non responsive team members_**: Assuming the team has exhausted all options to contact the team member (Phone call, Discord, Slack, etc.), we will contact our assigned TA to help us resolve the issue.

**_Major tasks that a team member doesn't want to do_**: Similar to how we will handle team members who are having trouble completing their tasks on time, the group will assign available members to help cut down work for the team member in question. Unless there is a mutual agreement with them and another team member to swap tasks, they will be held responsible for completing their task until it is completed. Afterwards, the team will not assign that team member any similar tasks moving forward.


----
### Highlights
1. Making a web app:  
**Context:** Originally, the project was proposed by the project partner as a mobile app.  
    **Options:**  
    I. Continue with the mobile app.
    *Advantages:* Better user experience for mobile devices.
    *Disadvantages:*
    * Not compatible with non-mobile platforms (emulation notwithstanding).
    * Depending on the architecture chosen, may require more work to create & update.
    * App updating will not be simple.

    II. Switch to a web app.
    *Advantages:*
    * Compatibility across all devices that support a modern internet browser.
    * Updating is simpler.
    
    *Disadvantages:* User experience may not be as good on mobile devices.  
   **Decision:** Web app  
   The better compatibility of a web app turned was something that our group through would be more valuable than a better mobile user experience, as it would be more convenient for the purposes of user management (especially because our partner explained to us that they make heavy use of spreadsheets, which are far more commonly used and found on non-mobile devices).
   
   In the end, though the final decision was not ours to make, after suggesting the change and explaining the advantages thereof, they agreed and the proposal was changed, accordingly.

2. Choosing a Solution for the Front-end:  
    **Context:** As a web app, our project needs a front-end, however, not everyone in our group is familiar with front-end work.  
    **Options:**  
    I. Vanilla (Standard HTML & JS)
    *Advantages:*
    * Simple and easy to learn.
    * Potentially, better compatibility with legacy browsers (e.g. IE).
    * Several of our group members are already familiar with HTML & JS.

    *Disadvantages:*
    * Horrible modularity (and likely lots of duplicate code)
    * No support for pre-made "extension" packages.
    * Potentially worse performance (especially, if dealing with the DOM).

    II. React
    *Advantages:*
    * Allows for much greater modularity.
    * VDOM has better performance than regular DOM.
    * React supports third-party modules (saves time over building from scratch).
    * Stricter error checking than Vanilla.
    * Two of our group members are already familiar with React.
    * Can be converted into a mobile app somewhat easily (through react-native).
    
    *Disadvantages:*
    * Not as simple as Vanilla JS & HTML (has a learning curve, especially with JSX).
    * Does not allow (reasonable) direct DOM modification.
    
    III. Angular:
    *Main consideration:* None of our group members is familiar with Angular.
    
   **Decision:** React  
   The advantages of React over Vanilla are very clear. In particular, modularity is a huge benefit and the benefit of modules is, likewise, massive. The learning curve of React, though unfortunate, is something that our members with experience can assist with (also, React is not particularly difficult to learn). However, the main consideration when it came to Angular was familiarity. As none of our members were familiar with Angular, this would be likely to cause our productivity to suffer initially (with respect to speed and quality), as we would learn Angular. Though React comes with a similar problem, those group members already familiar with React would certainly accelerate the learning process and would certainly lessen the severity of the initial productivity slowdown.


3. Choosing a Scheduling system:  
    **Context:** A scheduling system is required that is suitable for the often conflicting schedules of our group members.  
    **Options:**  
    I. Kanban (through GitHub):
    *Advantages:*
    * Flexible and adjustable (in several respects, primarily scheduling).
    * Allows for simple reallocation and redistribution of work, without lots of readjustment.

    *Disadvantages:*
    * Variable timeframes can result in drops in productivity.

    II. Scrum
    *Advantages:*
    * Sprints demand consistency in productivity
    * Organized and cohesive (with respect to work, allocation and roles)
    
    *Disadvantages:*
    * Must be strict, so as to be effective.
    * Readjustments (in the form of reallocation, adjustment, etc.) of work may require more work than in alternatives and may result in more problems (in the form of delays)
    
   **Decision:** Github’s Kanban  
   Although our group finds the advantages of scrum to be valid, we also acknowledge that with our various schedules, having a strict scrum arrangement might prove to be impossible. As such, a less-strict option would be preferred. Kanban, perhaps with a bit more rigour added, has the flexibility required, with respect to time and roles, that allows it to be very compatible with our team's structure. The fact that GitHub has an integrated kanban board also assisted in convincing us (having one less separate thing to keep track of is, in this case, a positive).
