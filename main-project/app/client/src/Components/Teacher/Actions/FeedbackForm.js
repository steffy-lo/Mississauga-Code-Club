import React from 'react';
import axios from "axios";

const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";


export const submitFeedback = (email, classId, feedbackFormData) => {
  return new Promise((resolve, reject) => {

    const { marks, feedback, recommended } = feedbackFormData;
    const requestObj = {
      email,
      classId,
      mark: marks,
      comments: feedback,
      nextCourse: recommended
    }

    console.log("submitting report: ", requestObj)
    axios.post(PREFIX + '/api/updatereport',
    requestObj, {headers: {"Content-Type": "application/json"}})
    .then(response => {
      console.log(response);
      resolve()
    })
    .catch(error => {
      console.log(error);
      reject()
    })
  })
}
