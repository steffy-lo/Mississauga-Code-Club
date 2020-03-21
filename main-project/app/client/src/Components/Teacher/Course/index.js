import React from "react";
import { setState, action, subscribe } from 'statezero';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EnrolledStudent from '../EnrolledStudent'
class Course extends React.Component {

    // Contains sample data
    state={
        enrolledStudents:[
            {firstName:"Kyle",
            lastName: "Tran",
            id:0},
            {firstName:"Jennifer",
            lastName:"Tu",
            id:1},
            {firstName:"Michelle",
            lastName:"Qualley",
            id:2}
        ],


    }

    // Displays the students in the state variable in the right format
    renderStudents = function(courseId){
        return (this.state.enrolledStudents).map(student =>(
             <li> <EnrolledStudent
                    firstName={student.firstName}
                    lastName = {student.lastName}
                    id={student.id}
                    courseId={courseId}
                  />
             </li> )
        );


    }

    render() {
        const { course, id } = this.props;
        return (
            <ExpansionPanel>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                      >
                      <dl className="course">
                          <dt>
                              <label>{course.courseName}</label>
                          </dt>
                          <dd>
                              {course.courseDesc}
                          </dd>
                      </dl>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                      <ul>
                        {this.renderStudents(id)}
                      </ul>
                      </ExpansionPanelDetails>
            </ExpansionPanel>

          );
    }
}

export default Course;
