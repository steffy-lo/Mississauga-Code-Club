import React from 'react';
import axios from "axios";
/* For local debugging */
const DEBUG = 1;

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

export const displayWorkHours = (hoursForm, hours, email) =>{
    hoursForm.state = hours;

};
