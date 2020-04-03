import React from "react";
import { uid } from "react-uid";
import Grades from "../Grades"
import './styles.css'
import axios from "axios";
import NavBarGeneric from "../../Util/NavbarGeneric";
import LoadingModal from "../../Util/LoadingModal";

class GradesView extends React.Component {

    constructor(props) {
        super(props);
        this.updateDisplay = this.updateDisplay.bind(this);
        this.getCompletedClasses = this.getCompletedClasses.bind(this);
        this.getMarks = this.getMarks.bind(this);
        this.state = {
            email: sessionStorage.getItem('email'),
            prefix: sessionStorage.getItem('prefix'),
            loading: true,
            data: []
        };
    }

    componentDidMount() {
        if (this.props.location.state != null) {
            this.getCompletedClasses(this.state.email);
        }
    }

    setInitialState() {
        const courseName = this.props.location.state.courseInfo.courseName;
        const courses = this.state.coursesCompleted.courseNames;
        for (let i = 0; i < courses.length; i++) {
            if (courses[i] === courseName) {
                this.setState({
                    course: courseName,
                    grades: this.state.data[i].grades,
                    comments: this.state.data[i].comments,
                    recommendations: this.state.data[i].recommendations
                });
            }
        }
        this.setState({'loading': false});
    }

    getMarks(email) {
        const currentComponent = this;
        const classIds = this.state.coursesCompleted.classIds;
        axios.get(currentComponent.state.prefix + '/api/mymarks/')
            .then(res => {
                console.log(res.data);
                const marks = res.data.marks;
                for (let i = 0; i < classIds.length; i++) {
                    const courseDetails = marks[classIds[i]];
                    if (courseDetails !== undefined) {
                        const grades = courseDetails.marks;
                        if (grades !== undefined) {
                            const gradesData = [];
                            for (let sectionTitle in grades) { // iterating through keys
                                if (grades.hasOwnProperty(sectionTitle)) {
                                    const earnedGrade = (grades[sectionTitle].mark === null) ? "-" : grades[sectionTitle].mark;
                                    gradesData.push({
                                        index: grades[sectionTitle].index,
                                        name: sectionTitle,
                                        grade: earnedGrade + "/" + grades[sectionTitle].weight
                                    })
                                }
                            }
                            gradesData.sort((a, b) => {
                                if (a.index < b.index) {
                                    return -1;
                                }
                                if (a.index > b.index) {
                                    return 1;
                                }
                                // a must be equal to b
                                return 0;
                            });
                            const new_data = this.state.data;
                            new_data.push({
                                course: this.state.coursesCompleted.courseNames[i],
                                grades: gradesData,
                                comments: courseDetails.comments,
                                recommendations: courseDetails.nextCourse.split(",")});
                            currentComponent.setState({data: new_data});
                        }
                    }
                }
                currentComponent.setInitialState();
            })
            .catch(error => {
                // handle error
                console.log(error);
            });
    }

    updateDisplay() {
        const sel = document.querySelector('#course-sel');
        const courseName = sel.value;
        const courses = this.state.coursesCompleted.courseNames;
        for (let i = 0; i < courses.length; i++) {
            if (courses[i] === courseName) {
                this.setState({
                    course: courseName,
                    grades: this.state.data[i].grades,
                    comments: this.state.data[i].comments,
                    recommendations: this.state.data[i].recommendations
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
                currentComponent.getMarks(email)

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
                <div>
                <NavBarGeneric/>
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
                    <textarea id="comments" value={this.state.comments} readOnly/>
                    <h2>Next Steps</h2>
                    {this.state.recommendations.map(course => (
                        <dl key={uid(course)} className="recommended-courses">
                            <dt>
                                <label>{course}</label>
                            </dt>
                        </dl>
                    ))}
                </div>
            </div>
            );
        } else {
            if (this.state.email === undefined) {
                return (
                    <div className="unavailable">
                        <h1>ERROR! Cannot Find Student...</h1>
                        <p>Please login and try again.</p>
                    </div>
                );
            } else {
                return <LoadingModal text="Getting student grades ..."/>;
            }
        }
    }
}

export default GradesView;