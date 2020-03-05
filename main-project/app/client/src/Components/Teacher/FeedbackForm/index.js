import React from "react";
import { setState, action, subscribe } from 'statezero';
import { Link } from 'react-router-dom';
import NavbarGeneric from '../../Util/NavbarGeneric';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import GradeInput from "../GradeInput";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import {submitFeedback} from "../Actions/FeedbackForm"
import './FeedbackForm.css';

class FeedbackForm extends React.Component {

    // Temporary data
    state = {
        students:[
            {firstName:"Kyle",
            lastName: "Tran",
            },
            {firstName:"Jennifer",
            lastName:"Tu",
            },
            {firstName:"Michelle",
            lastName:"Qualley",
            }
        ],
        inputs:{conditions:'0', variables:'0', loops:'0', functions:'0', recommended:{}, feedback:""},

    }

    // Updates state.inputs
    handleChange(event, name) {
        this.state.inputs[name] = event.target.value;
    }

    // Used for the recommended course field
    renderCourseOptions(){
        // TODO: Database
        const courses = [{courseName: "Robotics With Raspberry Pi 4 (2)", courseDesc: "Intermediate course for Robotics With Raspberry Pi 4"},
                         {courseName: "Project Based Python", courseDesc: "Build your own project using Python"}
                        ]
        return courses.map((course, index) => (<MenuItem value={course} key={index}>{course.courseName}</MenuItem>))
    }

    componentDidMount() {
        // TODO: Connect to database
        const {sid, cid} = this.props.match.params
        console.log("Opening feedback form for student "+sid + " in course " + cid)

    }

    render() {
        const {students} = this.state
        const {cid, sid} = this.props.match.params
        console.log(sid)
        return (
            <div>

                <NavbarGeneric/>
                <div id="feedback-form">
                    <h2>{students[sid].firstName} {students[sid].lastName}</h2>
                    <Grid>

                        {/* Grades*/}
                        <GradeInput name="conditions" value = "" onChange={this.handleChange.bind(this)}/>
                        <GradeInput name="variables" value = "" onChange={this.handleChange.bind(this)}/>
                        <GradeInput name="loops" value = "" onChange={this.handleChange.bind(this)}/>
                        <GradeInput name="functions" value = "" onChange={this.handleChange.bind(this)}/>

                        {/* Course Recommendation*/}
                        <div className="form-field" id="course-recommendation">
                            <h5>Recommended Courses</h5>
                            <TextField
                            className="input"
                            select
                            onChange={(event)=>this.handleChange(event, "recommended")}
                            >

                                {this.renderCourseOptions()}
                            </TextField>
                        </div>

                        {/* Written Feedback*/}
                        <div className="form-field" id="feedback">
                           <h5>Provide Feedback for {students[sid].firstName} {students[sid].lastName}</h5>
                           <TextField
                           className="input"
                           multiline
                           onChange={(event)=>this.handleChange(event, "feedback")}
                           />

                        </div>

                    </Grid>

                    <Button onClick={()=>submitFeedback(this)}>
                        Submit
                    </Button>


                </div>
            </div>
          );
    }
}

export default FeedbackForm;
