import React from "react";
import { uid } from "react-uid";
import Grades from "../Grades"
import './styles.css'
import axios from "axios";
import {getState} from "statezero";

class GradesView extends React.Component {

    constructor(props) {
        super(props);
        this.updateDisplay = this.updateDisplay.bind(this);
        this.getCompletedClasses = this.getCompletedClasses.bind(this);
        this.getMarks = this.getMarks.bind(this);
        this.state = {
            email: getState('email'),
            prefix: getState('prefix'),
            loading: true
        };
        this.data = [
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

                recommendations: ["Project Based Python", "Python Physical Computing", "Interactive Python"]
            
            },
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

                recommendations: ["Robotics With Raspberry Pi 4 (2)", "Intermediate course for Robotics With Raspberry Pi 4"]
            }
        ]
    }

    componentDidMount() {
        if (this.props.location.state != null) {
            this.getCompletedClasses(this.state.email);
            // this.getMarks(this.state.email);
        }
    }

    getMarks(email) {
        const currentComponent = this;
        const classIds = this.state.coursesCompleted.classIds;
        axios.get(currentComponent.state.prefix + '/api/mymarks/')
            .then(res => {
                console.log(res.data);
                const marks = res.data;
                for (let i = 0; i < classIds.length; i++) {
                    const courseDetails = marks[classIds[i].toString()];
                    if (courseDetails !== undefined) {
                        currentComponent.setState({
                            course: this.state.coursesCompleted.courseNames[i],
                            grades: courseDetails.marks.mark + "/" + courseDetails.marks.weight,
                            comments: courseDetails.comments,
                            recommendations: courseDetails.nextCourse
                        });
                    }
                }

                currentComponent.setState({'loading': false});
            })
            .catch(error => {
                // handle error
                console.log(error);
            });
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

    getCompletedClasses(email) {
        const currentComponent = this;
        axios.get(currentComponent.state.prefix + '/getClasses/'+ this.state.email)
            .then(function (response) {
                // handle success
                console.log(response.data);
                const classes = response.data.student;
                const completed = [];
                const completed_id = [];
                for (let i = 0; i < classes.length; i++) {
                    if (!classes[i].ongoing) {
                        completed.push(classes[i].name);
                        completed_id.push(classes[i].id);
                    }
                }
                currentComponent.setState({'coursesCompleted': {'classIds': completed_id, 'courseNames': completed}});

                //===========TEMPORARY CODE: CAN REMOVE ONCE THE BACKEND FOR GETTING MARKS HAS BEEN SETUP ==============
                const courseName = currentComponent.props.location.state.courseInfo.courseName;
                for (let i = 0; i < completed.length; i++) {
                    if (completed[i] === courseName) {
                        currentComponent.setState({
                            course: courseName,
                            grades: currentComponent.data[i].grades,
                            comments: currentComponent.data[i].comments,
                            recommendations: currentComponent.data[i].recommendations
                        });
                    }
                }

                currentComponent.setState({'loading': false});
                //=====================================================================================================

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    render() {
        if (this.state.email !== undefined && !this.state.loading) {
            const index = this.state.coursesCompleted.courseNames.indexOf(this.state.course);
            const otherCompletedCourses = [...this.state.coursesCompleted.courseNames];
            otherCompletedCourses.splice(index, 1);
            return (
                <div className="grades-view">
                    <select onChange={this.updateDisplay} className="courses-list" id="course-sel">
                        <option value="DEFAULT" name={this.state.course}>{this.state.course}</option>
                        {otherCompletedCourses.map(courseName => (
                            <option key={uid(courseName)} name={courseName}>{courseName}</option>
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
                        <dl key={uid(course)} className="recommended-courses">
                            <dt>
                                <label>{course}</label>
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