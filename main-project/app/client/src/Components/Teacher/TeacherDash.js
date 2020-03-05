import React from 'react';

import { setState, action, subscribe } from 'statezero';
import { uid } from "react-uid";

import NavbarGeneric from '../Util/NavbarGeneric';
import Course from './Course';
import TeacherToolbar from './TeacherToolbar';
import HoursForm from './HoursForm';
import {AppBar, Toolbar, Button} from "@material-ui/core";
import {loadToolbarSelection, displayWorkHours} from "./Actions/TeacherDash";
import "./TeacherDash.css";

class TeacherDash extends React.Component {
   state = {
      coursesTeaching: [
        {courseName: "Robotics With Raspberry Pi 4 (2)", courseDesc: "Intermediate course for Robotics With Raspberry Pi 4"},
        {courseName: "Project Based Python", courseDesc: "Build your own project using Python"}
      ],
      toolbarSelection: "courses"

  }



  renderToolbarSelection = function(){
      const selection = this.state.toolbarSelection;
      if(selection == "courses"){
          return(
            <div>
              <ul id="course-list">
                <li><Course course={this.state.coursesTeaching[0]} id="0"/></li>
                <li><Course course={this.state.coursesTeaching[1]} id="1"/></li>
              </ul>
            </div>
          )
      } else if(selection == "hours"){
          return(
            <HoursForm onButtonClick={displayWorkHours}>

            </HoursForm>
          )
      }

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
