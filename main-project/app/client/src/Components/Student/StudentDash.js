import React from 'react';
import axios from "axios";
import NavBarGeneric from '../Util/NavbarGeneric';
import './StudentDash.css';
import {Link} from "react-router-dom";
import {uid} from "react-uid";

import LoadingModal from '../Util/LoadingModal';
import StatusModal from '../Util/StatusModal';

class StudentDash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: sessionStorage.getItem('email'),
            prefix: sessionStorage.getItem('prefix'),
            loading: true
        };
        this.getClasses = this.getClasses.bind(this);
    }

    componentDidMount() {
        this.getClasses();
    }

    getClasses() {
        const currentComponent = this;
        axios.get(currentComponent.state.prefix + '/getClasses/'+ this.state.email)
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
		{this.state.modalWindow}
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
                                        <button>View Grades</button>
                                    </Link>
                                </dt>
                            </dl>
                        ))}
            </div>
		<button className="adminStyle" onClick={() => {this.setState({modalWindow: <StatusModal title="Help" text="This page shows all your or your child's classes. This allows you to see their report cards for completed classes." onClose={() => this.setState({modalWindow: ""})}/>}) }}>?</button>
                </div>
            </React.Fragment>
        );
    } else {
        return <LoadingModal text="Getting student data ..."/>;
    }
  }
}

export default StudentDash;
