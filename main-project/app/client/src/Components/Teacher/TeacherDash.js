import React from 'react';

import { setState, action, subscribe, getState } from 'statezero';
import { uid } from "react-uid";

import NavbarGeneric from '../Util/NavbarGeneric';
import Course from './Course';
import TeacherToolbar from './TeacherToolbar';
import HoursForm from './HoursForm';
import {AppBar, Toolbar, Button} from "@material-ui/core";
import {getActiveClasses, loadToolbarSelection} from "./Actions/TeacherDash";
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
      email: sessionStorage.getItem('email'),
      loading: true,
      toolbarSelection: "courses"

  }

  componentDidMount(){
      this.getClasses();
  }


  // Converts courseData's student list with the full student info
  getStudentInfo(courseData, idx){


      const currentComponent = this;
      axios.post(PREFIX + '/api/admin/getuser', {email : courseData.students[idx]})
          .then(function(response){
              courseData.students[idx] = response.data.result
      })
          .catch(function (error) {
              // handle error
              console.log(error);
      })

  }

  // Adds the course to the appropriate state variable with enrolled students
  getEnrollment(classId, ongoing){

      const currentComponent = this;

      axios.post(PREFIX + '/api/getclass', {_id : classId})
          .then(function(response){
              const courseData = {students:response.data.result.students,
                            id:classId,
                            name:response.data.result.courseTitle}

              for(let studentNum in courseData.students){
                  currentComponent.getStudentInfo(courseData, studentNum)
              }

              console.log("STUDENTS: ", courseData)
              if(ongoing){
                  currentComponent.state.coursesCompleted.push(courseData)
              } else {
                  currentComponent.state.coursesTeaching.push(courseData)
              }
      })
          .catch(function (error) {
              // handle error
              console.log(error);
      })

  }

  // Populates state variables for courses
  getClasses(){
      const currentComponent = this;

      axios.get(PREFIX + '/getClasses/'+ this.state.email)
          .then(function (response) {
              // handle success
              const courses = response.data.instructor;
              for(let course of courses){
                  currentComponent.getEnrollment(course.id, course.ongoing);
              }
              console.log(currentComponent.state)
              currentComponent.setState({'loading': false});

          })
          .catch(function (error) {
              // handle error
              console.log(error);
          })
  }


  // Return either the list of courses of work hours form, depending on the selection
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
            
            email={this.state.email}>

            </HoursForm>
          )
      }

  }

  // Return course elements corresponding to current state
  renderCurrentCourses = function(){
      return (this.state.coursesTeaching).map((course, idx) =>(
           <li> <Course
                  name={course.name}
                  id={course.id}
                  enrolledStudents={course.students}
                />
           </li> )
      );
  }

  // Return course elements corresponding to current state
  renderCompletedCourses = function(){
      return (this.state.coursesCompleted).map((course, idx) =>(
           <li> <Course
                  name={course.name}
                  id={course.id}
                  enrolledStudents={course.students}
                />
           </li> )
      );
  }


  render() {
    console.log("EMAIL: ", this.state.email)
    return(
      <React.Fragment>
        <NavbarGeneric/>
        <div id="teacher-view">
            <TeacherToolbar
                handleButtonSelect={value=>loadToolbarSelection(this, value)}
            />
            {this.renderToolbarSelection()}
        </div>
      </React.Fragment>
    )
  }
}

export default TeacherDash;
