import React from 'react';


export const loadToolbarSelection = (teacherDash, value) => {
    teacherDash.state.toolbarSelection = value;
    teacherDash.forceUpdate();
};

export const displayWorkHours = (hoursForm, hours) =>{
    hoursForm.state = hours;
};
