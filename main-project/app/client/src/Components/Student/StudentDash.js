import React from 'react';
import { setState, action, subscribe } from 'statezero';

import NavBarGeneric from '../Util/NavbarGeneric';
import './StudentDash.css';

class StudentDash extends React.Component {
  render() {
    setState('uType', 0);
    return(
      <React.Fragment>
        <div>
          <NavBarGeneric />
        {/* This is the student dashboard. */}
          <div class="enrolled">
            <h1>Enrolled Courses</h1>
            <dl class="current-courses">
              <dt>
                <label>Robotics With Raspberry Pi 4 (2)</label>
              </dt>
              <dd>Intermediate course for Robotics With Raspberry Pi 4</dd>
            </dl>
            <dl class="current-courses">
              <dt>
                <label>Project Based Python</label>
              </dt>
              <dd>Build your own project using Python</dd>
            </dl>
          </div>
          <div class="completed">
            <h1>Completed Courses</h1>
            <dl class="completed-courses">
              <dt>
                <label>Robotics With Raspberry Pi 4 (1)</label>
              </dt>
              <dd>Introductory course for Robotics With Raspberry Pi 4</dd>
              <dt>
                <button>View Grades</button>
              </dt>
            </dl>
            <dl class="completed-courses">
              <dt>
                <label>Introduction to Python</label>
              </dt>
              <dd>Introductory course for programming in Python</dd>
              <dt>
                <button>View Grades</button>
              </dt>
            </dl>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default StudentDash;
