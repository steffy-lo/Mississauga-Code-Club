import React from 'react';

import { setState, action, subscribe, getState } from 'statezero';
import { uid } from "react-uid";

import NavbarGeneric from '../Util/NavbarGeneric';
import Course from './Course';
import TeacherToolbar from './TeacherToolbar';
import HoursForm from './HoursForm';
import {AppBar, Toolbar, Button} from "@material-ui/core";
import {getActiveClasses, loadToolbarSelection, displayWorkHours} from "./Actions/TeacherDash";
import axios from "axios";
import "./TeacherDash.css";

/* For local debugging */
const DEBUG = 1;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

class TeacherDash extends React.Component {
   state = {
      coursesTeaching: [],
      coursesCompleted:[],
      email: getState('email'),
      loading: true,
      toolbarSelection: "courses"

  }

  componentDidMount(){
      this.getClasses();
  }

  getClasses(){
      const currentComponent = this;
      axios.get(PREFIX + '/getClasses/'+ this.state.email)
          .then(function (response) {
              // handle success
              console.log("response", response)
              const classes = response.data.instructor;
              const enrolled = [];
              const completed = [];
              console.log("\tclasses ", classes)

              // Update state
              for (let i = 0; i < classes.length; i++) {
                  if (classes[i].ongoing) {
                      enrolled.push({'courseName': classes[i].name})
                  } else {
                      completed.push({'courseName': classes[i].name})
                  }
              }
              console.log('completed ', completed)
              currentComponent.setState({'coursesTeaching': enrolled, 'coursesCompleted': completed});
              currentComponent.setState({'loading': false});

          })
          .catch(function (error) {
              // handle error
              console.log(error);
          })
  }

  renderToolbarSelection = function(){
      const selection = this.state.toolbarSelection;
      if(selection == "courses"){
          return(
            <div>
              <ul id="course-list">

                <h3>Currently Teaching </h3>
                {this.renderCurrentCourses()}

                <h3>Inactive</h3>

                {this.renderCompletedCourses()}


              </ul>
            </div>
          )
      } else if(selection == "hours"){
          return(
            <HoursForm
            onButtonClick={displayWorkHours}
            email={this.state.email}>
                       
            </HoursForm>
          )
      }

  }

  // Return course elements corresponding to current state
  renderCurrentCourses = function(){
      return (this.state.coursesTeaching).map((course, idx) =>(
           <li> <Course
                  course={course}
                  id={idx}
                />
           </li> )
      );
  }

  // Return course elements corresponding to current state
  renderCompletedCourses = function(){
      return (this.state.coursesCompleted).map((course, idx) =>(
           <li> <Course
                  course={course}
                  id={idx}
                />
           </li> )
      );
  }


  render() {
    return(
      <React.Fragment>
        <NavbarGeneric/>
        This is the teacher dashboard.
        <TeacherToolbar
            handleButtonSelect={value=>loadToolbarSelection(this, value)}
        />
        {this.renderToolbarSelection()}
      </React.Fragment>
    )
  }
}

export default TeacherDash;
