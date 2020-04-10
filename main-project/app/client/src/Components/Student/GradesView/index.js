import React from "react";
import { uid } from "react-uid";
import Grades from "../Grades"
import axios from "axios";
import NavBarGeneric from "../../Util/NavbarGeneric";
import LoadingModal from "../../Util/LoadingModal";

import './styles.css'
import "../../CSS/Common.css"

import HelpButton from "../../Util/HelpButton";

/**
 * View for Students' Grades.
 * In this view, the student who is logged in is able to see his/her grades for completed courses.
 *
 * @extends React
 */
class GradesView extends React.Component {

    constructor(props) {
        super(props);
        this.updateDisplay = this.updateDisplay.bind(this);
        this.getCompletedClasses = this.getCompletedClasses.bind(this);
        this._getMarks = this._getMarks.bind(this);
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

    /**
     * FUNCTIONALITY: This method sets the state of the component with all the detailed grade information fetched
     * before the final rendering of the page.
     * CONTEXT: This function is the last function called right before the final rendering
     *
     */
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

    /**
     * HELPER FUNCTION for the getCompletedClasses method.
     * Sends a GET request to retrieve the grades of each of the completed course of the given student's through his/her
     * associated email.
     *
     * @param  email - the email of the student's whose grades we want to retrieve
     *
     */
    _getMarks(email) {
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

    /**
     * FUNCTIONALITY: This method updates the associated grade information given the currently selected course from the
     * selector by setting the appropriate state changes.
     *
     */
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

    /**
     * FUNCTIONALITY: This method gets the classes completed by the logged in user, and gets the marks associated with
     * each completed course through the getMarks helper method.
     *
     */
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
		{this.state.modalWindow}
                <NavBarGeneric crumbs={[{tag: "Dashboard", link: "/"}, {tag: `Grades for ${this.state.course}`}]}
		help={
                <HelpButton
                      text="This page shows your marks for sections of courses, overall comments by your instructor, and any recommendations they have for next courses for you to take."
                      parentForClose = {this}
                    />
		}/>
                <div className="flexContentContainerGeneric">
                <div className="grades-view">
                    <select onChange={this.updateDisplay} className="selCourseStu" id="course-sel">
                        <option value="DEFAULT" name={this.state.course}>{this.state.course}</option>
                        {otherCompletedCourses.map(courseName => (
                            <option key={uid(courseName)} name={courseName}>{courseName}</option>
                        ))}
                    </select>
                    <h2 className="stuGradesHeader">Your Grades</h2>
                    {/* unique id required to help React render more efficiently */}
                    <div id="stuGradesGradePane">
                      {this.state.grades.map(entry => (
                          <Grades
                          key={uid(entry)}
                          entry={entry}/>
                      ))}
                    </div>
                    <h2 className="stuGradesHeader">Teacher's Comments</h2>
                    <textarea
                      rows="10"
                      className="stuGradesFeedbackBox"
                      value={this.state.comments} readOnly/>
                    <h2 className="stuGradesHeader">Next Steps</h2>
                      {<textarea
                        rows="5"
                        className="stuGradesFeedbackBox"
                        value={this.state.recommendations} readOnly/>}
                </div>
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
                return (
                  <div>
		    {this.state.modalWindow}
                    <LoadingModal text="Getting student grades ..."/>
                    <NavBarGeneric crumbs={[{tag: "Dashboard", link: "/"}, {tag: `Grades`}]}

		    help={
                <HelpButton
                      text="This page shows your marks for sections of courses, overall comments by your instructor, and any recommendations they have for next courses for you to take."
                      parentForClose = {this}
                    />
		}/>
                  </div>
                  )
            }
        }
    }
}

export default GradesView;
