import React from 'react';
import axios from "axios";
import NavBarGeneric from '../Util/NavbarGeneric';
import './StudentDash.css';
import {getState} from "statezero";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {uid} from "react-uid";

class StudentDash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: getState('email'),
            loading: true
        };
        this.getClasses = this.getClasses.bind(this);
    }

    componentDidMount() {
        this.getClasses();
    }

    getClasses() {
        const currentComponent = this;
        axios.get(currentComponent.props.state.prefix + '/getClasses/'+ this.state.email)
            .then(function (response) {
                // handle success
                console.log(response.data);
                const classes = response.data.student;
                const enrolled = [];
                const completed = [];
                for (let i = 0; i < classes.length; i++) {
                    if (classes[i].ongoing) {
                        enrolled.push({'courseName': classes[i].name})
                    } else {
                        completed.push({'courseName': classes[i].name})
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
                            <dl key={uid(course)} className="current-courses">
                                <dt>
                                    <label>{course.courseName}</label>
                                </dt>
                            </dl>
                        ))}
                    </div>
                    <div className="completed">
                        <h1>Completed Courses</h1>
                        {this.state.coursesCompleted.map(course => (
                            <dl key={uid(course)} className="completed-courses">
                                <dt>
                                    <label>{course.courseName}</label>
                                </dt>
                                <dt>
                                    <Link to={{pathname: '/s/grades',
                                        state: {courseInfo: course}}}>
                                        <Button>View Grades</Button>
                                    </Link>
                                </dt>
                            </dl>
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
