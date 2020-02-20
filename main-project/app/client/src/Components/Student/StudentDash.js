import React from 'react';
import { uid } from "react-uid";
import { setState, action, subscribe } from 'statezero';

import NavBarGeneric from '../Util/NavbarGeneric';
import './StudentDash.css';
import CurrentCourse from "./CurrentCourse";
import CompletedCourse from "./CompletedCourse";

class StudentDash extends React.Component {
  state = {
    coursesEnrolled: [
      {courseName: "Robotics With Raspberry Pi 4 (2)", courseDesc: "Intermediate course for Robotics With Raspberry Pi 4"},
      {courseName: "Project Based Python", courseDesc: "Build your own project using Python"}
    ],
    coursesCompleted: [
      {courseName: "Robotics With Raspberry Pi 4 (1)", courseDesc: "Introductory course for Robotics With Raspberry Pi 4"},
      {courseName: "Introduction to Python", courseDesc: "Introductory course for programming in Python"}
    ]
  }
  render() {
    setState('uType', 0);
    return(
      <React.Fragment>
        <div>
          <NavBarGeneric />
        {/* This is the student dashboard. */}
          <div class="enrolled">
            <h1>Enrolled Courses</h1>
            {this.state.coursesEnrolled.map(course => (
              <CurrentCourse
                key={uid(
                  course
                )} /* unique id required to help React render more efficiently when we modify the students list. */
                course={course}
              />
            ))}
          </div>
          <div class="completed">
            <h1>Completed Courses</h1>
            {this.state.coursesCompleted.map(course => (
              <CompletedCourse
                key={uid(
                  course
                )} /* unique id required to help React render more efficiently when we modify the students list. */
                course={course}
              />
            ))}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default StudentDash;
