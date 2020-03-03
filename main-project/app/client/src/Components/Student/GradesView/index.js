import React from "react";
import { uid } from "react-uid";
import Grades from "../Grades"
import './styles.css'

class GradesView extends React.Component {

    constructor(props) {
        super(props);
        this.updateDisplay = this.updateDisplay.bind(this);
        this.data = [
            {
                courseName: "Robotics With Raspberry Pi 4 (1)",
                grades: [
                    {name: "Knowledge", grade: 1},
                    {name: "Thinking", grade: 0.75},
                    {name: "Application", grade: 0.5},
                    {name: "Extra", grade: 0.65}
                ],
                comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, \
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris \
                nisi ut aliquip ex ea commodo consequat.",
                recommendations: [
                    {courseName: "Robotics With Raspberry Pi 4 (2)", courseDesc: "Intermediate course for Robotics With Raspberry Pi 4" }
                ]
            },
    
            {
                courseName: "Introduction to Python",
                grades: [
                    {name: "Conditions", grade: 0.75},
                    {name: "Variables", grade: 1},
                    {name: "Loops", grade: 0.5},
                    {name: "Functions", grade: 0.75}
                ],
                comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, \
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris \
                nisi ut aliquip ex ea commodo consequat.",
                recommendations: [
                    {courseName: "Project Based Python", courseDesc: "Build your own project using Python" },
                    {courseName: "Python Physical Computing", courseDesc: "Learn physical computing with Python" },
                    {courseName: "Interactive Python", courseDesc: "Learn human-computer interaction with Python" }
                ]
            
            }
        ]
    }

    componentDidMount() {
        if (this.props.location.state != null) {
            const courseName = this.props.location.state.courseInfo.courseName
            console.log(courseName)
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].courseName === courseName) {
                    this.setState({
                        course: courseName,
                        grades: this.data[i].grades,
                        comments: this.data[i].comments,
                        recommendations: this.data[i].recommendations
                    });
                }
            }
            console.log(this.props.location.state)
        }
    }

    updateDisplay() {
        const sel = document.querySelector('#course-sel');
        const courseName = sel.value;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].courseName === courseName) {
                this.setState({
                    course: courseName,
                    grades: this.data[i].grades,
                    comments: this.data[i].comments,
                    recommendations: this.data[i].recommendations
                });
                sel.selectedIndex = 0;
            }
        }
    }

    render() {
        console.log(this.state)
        if (this.state != null) {
            const otherCompletedCourses = ["Robotics With Raspberry Pi 4 (1)", "Introduction to Python"] // get all completed courses
            const index = otherCompletedCourses.indexOf(this.state.course);
            if (index > -1) {
                otherCompletedCourses.splice(index, 1);
            }
            return (
                <div class="grades-view">
                    <select onChange={this.updateDisplay} class="courses-list" id="course-sel">
                        <option selected={true} name={this.state.course}>{this.state.course}</option>
                        {otherCompletedCourses.map(courseName => (
                            <option name={courseName}>{courseName}</option>
                        ))}
                    </select>
                    <h2>Your Grades</h2>
                    {this.state.grades.map(entry => (
                        <Grades
                        key={uid(
                        entry
                        )} /* unique id required to help React render more efficiently*/
                        entry={entry}/>
                    ))}
                    <h2>Teacher's Comments</h2>
                    <p id="comments">{this.state.comments}</p>
                    <h2>Next Steps</h2>
                    {this.state.recommendations.map(course => (
                        <dl className="recommended-courses">
                            <dt>
                                <label>{course.courseName}</label>
                            </dt>
                        </dl>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    }
}

export default GradesView;