import React from "react";
import axios from "axios";
import NavBarGeneric from "../Util/NavbarGeneric";
import { logout, deauthorise } from './auth';

import { Link } from "react-router-dom";
import { uid } from "react-uid";

import "./StudentDash.css";
import "../CSS/Common.css"

import LoadingModal from "../Util/LoadingModal";
import HelpButton from "../Util/HelpButton";

/**
 * View for the Student Dashboard.
 * In this view, the student who is logged in is able to see his/her currently enrolled courses and completed courses.
 * For each completed course, the associated grade can be viewed by clicking the "view grade" button, bringing the user
 * to the grades view, showing a detailed breakdown of the grades the student has received in the course.
 *
 * @extends React
 */
class StudentDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalWindow: "",
      email: sessionStorage.getItem("email"),
      prefix: sessionStorage.getItem("prefix"),
      loading: true
    };
    this.getClasses = this.getClasses.bind(this);
  }

  componentDidMount() {
    this.getClasses();
  }

  /**
   * FUNCTIONALITY: This method performs a GET request of the corresponding classes given the student's email.
   * CONTEXT: This function is called right before rendering (i.e., as soon as the component is mounted)
   *
   */
  getClasses() {
    this.setState({modalWindow: <LoadingModal text="Getting student data ..." />})
    const currentComponent = this;
    axios
      .get(currentComponent.state.prefix + "/getClasses/" + this.state.email)
      .then(function(response) {
        // handle success
        console.log(response.data);
        const classes = response.data.student;
        const enrolled = [];
        const completed = [];
        for (let i = 0; i < classes.length; i++) {
          if (classes[i].ongoing) {
            enrolled.push({ courseName: classes[i].name });
          } else {
            completed.push({ courseName: classes[i].name });
          }
        }
        currentComponent.setState({
          coursesEnrolled: enrolled,
          coursesCompleted: completed,
          modalWindow: ""
        });
      })
      .catch(function(error) {
        // handle error
          if (error.response.status === 401) {
              deauthorise();
              window.location.reload(true);
          } else if (error.response.status === 400 || error.response.status === 500) {
              logout();
              deauthorise();
              window.location.reload(true);
          }
        this.setState({modalWindow: ""})
        console.log(error);
      });
  }

  render() {
      return (
        <React.Fragment>
          {this.state.modalWindow}
            <NavBarGeneric crumbs={[{tag: "Dashboard"}]}
              help={
                <HelpButton
                      text="This page shows all your or your child's classes.
                      This allows you to see their report cards for completed classes."
                      parentForClose = {this}
                    />
              }/>
            {/* This is the student dashboard. */}
            <div id="studentDashWrapper">
              <div className="enrolled">
                <h1>Enrolled Courses</h1>
                <div>
                {!this.state.coursesEnrolled ?
                  <h2 className="centreText">Not currently enrolled in any courses</h2>
                  :
                  this.state.coursesEnrolled.map(course => (
                  <dl key={uid(course)} className="current-courses">
                    <dt>
                      <p>{course.courseName}</p>
                    </dt>
                  </dl>
                ))}
              </div>
            </div>
              <div className="completed">
                <h1>Completed Courses</h1>
                <div>
                {!this.state.coursesCompleted ?
                  <h2 className="centreText">No courses have been completed, yet</h2>
                  :
                  this.state.coursesCompleted.map(course => (
                  <dl key={uid(course)} className="completed-courses">
                    <dt>
                      <p>{course.courseName}</p>
                    </dt>
                    <dt>
                      <Link
                        to={{
                          pathname: "/s/grades",
                          state: { courseInfo: course }
                        }}
                      >
                        <button>View Grades</button>
                      </Link>
                    </dt>
                  </dl>
                ))}
              </div>
              </div>
            </div>
        </React.Fragment>
      );
    }
  }

export default StudentDash;
