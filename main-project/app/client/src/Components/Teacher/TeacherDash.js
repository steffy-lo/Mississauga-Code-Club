import React from 'react';
import { Link } from 'react-router-dom';

import NavbarGeneric from '../Util/NavbarGeneric';
import LoadingModal from "../Util/LoadingModal";
import StatusModal from "../Util/StatusModal";

import {AppBar, Toolbar, Button} from "@material-ui/core";
import { getClasses, getEnrollment } from "./Actions/TeacherDash";
import { getUserTypeExplicit } from "../../Actions/utility";

import "./TeacherDash.css";
import "../CSS/Common.css"

class TeacherDash extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
       modalWindow: "",
       allCourses: [],
       studentListDisplayed: "",
       showOngoing: true,
       selectedClass: null
   }
   this.uType = getUserTypeExplicit()[0];
  }


  componentDidMount(){
      this.getClassesList();
  }

  getClassesList() {
    this.setState({modalWindow: <LoadingModal text="Getting Classes ..." />})
    getClasses()
    .then(classes => {
      this.setState({
        allCourses: classes,
        modalWindow: ""
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  generateClassesList() {
    const displayClassList = [];
    for (let iClass of this.state.allCourses) {
      if (iClass.ongoing === this.state.showOngoing) {
        displayClassList.push(
          <p key={iClass.id}
             onClick={e => {
               this.setState({ selectedClass: iClass })
               this.generateStudentList(iClass)}
             }
          >
            {iClass.name}
          </p>
        )
      }
    }
    return displayClassList;
  }

  generateStudentList(iClass) {
    const loadingString = `Getting Enrollment for ${iClass.name} ...`
    this.setState({
      modalWindow: <LoadingModal text={loadingString} />
    })
    getEnrollment(iClass.id)
    .then(enrollment => {
      const resultList = []
      for (let student of enrollment.students) {
        const linkString = `/${this.uType}/course=${iClass.id}/student=${student}`;
        resultList.push(<Link to={linkString}>{student}</Link>);
      }
      this.setState({
        studentListDisplayed: resultList,
        modalWindow: ""
    })
    })
    .catch(err => {
      this.setState({
        modalWindow: (
          <StatusModal
            title="Could not get class data"
            text="Failed"
            onClose={() => this.setState({modalWindow: ""})}/>
        ),
        selectedClass: null,
        studentListDisplayed: ""
      })
    })
  }

  render() {
    const navList = this.uType === 'a' ?
      [{tag: "Dasboard", link: "/a/"}, {tag: "Course List"}]
    :
      [{tag: "Dashboard"}]
    const buttonVars = this.state.showOngoing ?
      ["Active Courses", "tDC2LActiveCourses", "Click to show completed courses"]
      : ["Completed Courses", "tDC2LInactiveCourses", "Click to show active courses"]
    return(
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric crumbs={navList}/>
        <div>

        </div>
        <div className="flexContentContainerGeneric reverseWrap">
          <div id="tDashCourseList">
            <h1>Classes:</h1>
            <div>
              <h3 id={buttonVars[1]}
                title={buttonVars[2]}
                onClick={e => this.setState({
                  showOngoing: !this.state.showOngoing
                })}
                >{buttonVars[0]}</h3>
              <div id="tDashCourseLinkList">
                {this.generateClassesList()}
              </div>
            </div>
          </div>
          <div id="tDashStudentList">
            <h1>Students:</h1>

            {
              /*
              Triple selection.
              The first option succeeds only on first opening the page & after
              an error.
              Otherwise, for empty classes, the second option appears,
              If the class is not empty, then this will, instead, be a list of
              students in the class.
               */
              this.state.selectedClass === null ?
                <div><h3>Please select a class</h3></div>
              :
                this.state.studentListDisplayed === "" ?
                  <div><h3>This class is empty</h3></div>
                :
                  <div>
                    <h3>{this.state.selectedClass.name}</h3>
                    <div id="tDashStudentLinkList">
                      {this.state.studentListDisplayed}
                    </div>
                  </div>
            }
            <button
            id="tDashToReport"
            disabled={this.state.selectedClass === null}
            onClick={e => {
              this.props.history.push(`/${this.uType}/course/${this.state.selectedClass.id}`)
            }}
            >
            Modify Class Report
          </button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default TeacherDash;
