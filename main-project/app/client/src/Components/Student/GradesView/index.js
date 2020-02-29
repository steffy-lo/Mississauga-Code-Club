import React from "react";
import { uid } from "react-uid";
import Grades from "../Grades"
import Course from "../Course";
import './styles.css'

class GradesView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            course: null,
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
    }

    componentDidMount() {
        if (this.props.location.state != null) {
            this.setState({
                course: this.props.location.state.courseInfo.courseName
            });
            console.log(this.props.location.state)
        }
    }

    render() {
        if (this.state.course != null) {
            return (
                <div class="grades-view">
                    <select class="courses-list" id="course-sel">
                        <option name={this.state.course}>{this.state.course}</option>
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
                        <Course
                        key={uid(
                        course
                        )} /* unique id required to help React render more efficiently*/
                        course={course}/>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    }
}

export default GradesView;