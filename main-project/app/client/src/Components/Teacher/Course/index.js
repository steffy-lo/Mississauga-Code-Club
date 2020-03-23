import React from "react";
import { setState, action, subscribe } from 'statezero';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EnrolledStudent from '../EnrolledStudent'
class Course extends React.Component {

    state={
        enrolledStudents:[],
        name: "",

    }

    // Displays the students in the course as a list
    renderStudents = function(){
        return (this.state.enrolledStudents).map(student =>(
             <li> <EnrolledStudent
                    firstName={student.firstName}
                    lastName = {student.lastName}
                    email={student.email}
                    courseId={this.state.id}
                  />
             </li> )
        );


    }

    render() {
        const { name, id, enrolledStudents} = this.props;
        this.state.enrolledStudents = enrolledStudents;
        this.state.name = name;
        this.state.id = id
        return (
            <ExpansionPanel>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                      >
                      <dl className="course">
                          <dt>
                              <label>{name}</label>
                          </dt>

                      </dl>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                      <ul>
                        {this.renderStudents()}
                      </ul>
                      </ExpansionPanelDetails>
            </ExpansionPanel>

          );
    }
}

export default Course;
