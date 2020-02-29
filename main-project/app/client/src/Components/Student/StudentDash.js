import React from 'react';
import { uid } from "react-uid";
import axios from "axios";
import NavBarGeneric from '../Util/NavbarGeneric';
import './StudentDash.css';
import CurrentCourse from "./Course";
import CompletedCourse from "./CompletedCourse";
import {getState} from "statezero";

/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

class StudentDash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: getState('email'),
            loading: true
            // coursesEnrolled: [
            //     {courseName: "Robotics With Raspberry Pi 4 (2)", courseDesc: "Intermediate course for Robotics With Raspberry Pi 4"},
            //     {courseName: "Project Based Python", courseDesc: "Build your own project using Python"}
            // ],
            // coursesCompleted: [
            //     {courseName: "Robotics With Raspberry Pi 4 (1)", courseDesc: "Introductory course for Robotics With Raspberry Pi 4"},
            //     {courseName: "Introduction to Python", courseDesc: "Introductory course for programming in Python"}
            // ]
        };
        this.getClasses = this.getClasses.bind(this);
    }

    componentDidMount() {
        this.getClasses();
    }

    getClasses() {
        const currentComponent = this;
        axios.get(PREFIX + '/getClasses/'+ this.state.email)
            .then(function (response) {
                // handle success
                console.log(response.data);
                const classes = response.data.student;
                const enrolled = [];
                const completed = [];
                for (let i = 0; i < classes.length; i++) {
                    if (classes[i].ongoing) {
                        enrolled.push({'courseName': classes[i].name, 'courseDesc': classes[i].desc})
                    } else {
                        completed.push({'courseName': classes[i].name, 'courseDesc': classes[i].desc})
                    }
                }
                currentComponent.setState({'coursesEnrolled': enrolled, 'coursesCompleted': completed});
                currentComponent.setState({'loading': false});

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

  render() {
    if (!this.state.loading) {
        return (
            <React.Fragment>
                <div>
                    <NavBarGeneric/>
                    {/* This is the student dashboard. */}
                    <div className="enrolled">
                        <h1>Enrolled Courses</h1>
                        {this.state.coursesEnrolled.map(course => (
                            <CurrentCourse
                                key={uid(
                                    course
                                )} /* unique id required to help React render more efficiently*/
                                course={course}
                            />
                        ))}
                    </div>
                    <div className="completed">
                        <h1>Completed Courses</h1>
                        {this.state.coursesCompleted.map(course => (
                            <CompletedCourse
                                key={uid(
                                    course
                                )} /* unique id required to help React render more efficiently*/
                                course={course}
                            />
                        ))}
                    </div>
                </div>
            </React.Fragment>
        );
    } else {
        return null;
    }
  }
}

export default StudentDash;
