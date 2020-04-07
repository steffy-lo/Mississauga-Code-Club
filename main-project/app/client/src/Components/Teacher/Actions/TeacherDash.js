import React from 'react';
import axios from "axios";
/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:3000" : "";

export const getActiveClasses = (teacherDash) => {
    return  axios.get(PREFIX + "/getactiveclasses");
    //teacherDash.state.activeCourses = axios.get(PREFIX + "/getactiveclasses");
}

export const loadToolbarSelection = (teacherDash, value) => {
    teacherDash.state.toolbarSelection = value;
    teacherDash.forceUpdate();
};

export const getClasses = () => {
  return new Promise((resolve, reject) => {
    axios.get(PREFIX + '/getClasses/'+ sessionStorage.email)
    .then((response) => {
      console.log(response)
      if (!response || !response.data || !response.data.instructor) reject("Bad")
      resolve(response.data.instructor);
    })
    .catch((error) => {
      reject(error);
    })
  })
}

export const getEnrollment = (classId) => {
  return new Promise((resolve, reject) => {
    axios.post(PREFIX + '/api/getclass',
    JSON.stringify({"_id": classId}),
    {headers: {"Content-Type": "application/json"}})
    .then((response) => {
      console.log(response);
      if (!response || !response.data || !response.data.result) reject("Bad'")
      resolve(response.data.result)
      })
      .catch((error) => {
        // handle error
        reject(error);
      })
    })
  }
