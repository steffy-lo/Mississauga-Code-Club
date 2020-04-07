import React from "react";
import axios from "axios";

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

/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

class FeedbackForm extends React.Component {

constructor(props) {
  super(props);
    this.state = {
        studentEmail: "",
        courseId: "",
        studentInfo: {},
        courseInfo: {},
        inputs: {conditions:'0', variables:'0', loops:'0', functions:'0'},
        recommended:{},
        feedback:"",
        submitted: false
    }
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
        this.state.studentEmail = sid
        this.state.courseId = cid
        this.getInfo()

    }

    // Updates state with course and student info
    getInfo(){
        const currentComponent = this;
        axios.post(PREFIX + '/api/admin/getuser', {email : this.state.studentEmail})
            .then(function(response){
                currentComponent.setState({studentInfo:response.data.result})
        })
            .catch(function (error) {
                // handle error
                console.log(error);
        })
        axios.post(PREFIX + '/api/getclass', {_id : this.state.courseId})
            .then(function(response){
                currentComponent.state.courseInfo = response.data.result
        })
            .catch(function (error) {
                // handle error
                console.log(error);
        })
    }

    render() {
        const {students} = this.state
        const {cid, sid} = this.props.match.params

        return (
            <div>

                <NavbarGeneric/>
                <div id="feedback-form">
                    <h2>{this.state.studentInfo.firstName} {this.state.studentInfo.lastName}</h2>
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
                            onChange={(event)=> this.setState({recommended: event.target.value})}
                            >

                                {this.renderCourseOptions()}
                            </TextField>
                        </div>

                        {/* Written Feedback*/}
                        <div className="form-field" id="feedback">
                           <h5>Provide Feedback for {this.state.studentInfo.firstName} {this.state.studentInfo.lastName}</h5>
                           <TextField
                           className="input"
                           multiline
                           onChange={(event)=> this.setState({feedback: event.target.value})}
                           />

                        </div>

                    </Grid>

                    <Button onClick={()=>submitFeedback(this)}>
                        Submit
                    </Button>
                    {
                        (() => {
                                if(this.state.submitted){
                                    return <p>Report submitted successfully</p>
                                }
                        })()
                    }


                </div>
            </div>
          );
    }
}

export default FeedbackForm;
