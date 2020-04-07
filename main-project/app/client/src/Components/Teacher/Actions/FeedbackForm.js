import React from 'react';
import axios from "axios";

const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";


export const submitFeedback = (feedbackForm) => {
    const currentComponent = feedbackForm

    console.log("submitting report:",{
        classId:currentComponent.state.courseId,
        email:currentComponent.state.studentEmail,
        mark:currentComponent.state.inputs,
        comments: currentComponent.state.inputs.feedback
    })
    axios.post(PREFIX + '/api/updatereport', {
        classId:currentComponent.state.courseId,
        email:currentComponent.state.studentEmail,
        mark:currentComponent.state.inputs,
        nextCourse: currentComponent.state.recommended,
        comments: currentComponent.state.feedback
    })
        .then(function (response) {
            // handle success
            console.log(response.data);
            currentComponent.setState({submitted: true})
            currentComponent.forceUpdate()

        })
        .catch(function (error) {
            // handle error

            console.log(error);
        })
}
