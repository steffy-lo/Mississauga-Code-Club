import React from 'react';
import './App.css';
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import Login from './Components/Auth/Login';

import StudentDash from './Components/Student/StudentDash';
import StudentGrades from './Components/Student/GradesView';

import AdminDash from './Components/Admin/AdminDash';
import CheckIn from './Components/Admin/CheckIn';

import VolunteerDash from './Components/Volunteer/VolunteerDash';


import TeacherDash from './Components/Teacher/TeacherDash';

import ViewHours from './Components/Util/ViewHours';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/s" component={StudentDash}/>
        <Route exact path="/s/grades" component={StudentGrades}/>
        <Route exact path="/a" component={AdminDash}/>
        <Route exact path="/a/hours" component={ViewHours}/>
        <Route exact path="/a/checkin" component={CheckIn}/>
        <Route exact path="/v" component={VolunteerDash}/>
        <Route exact path="/v/hours" component={ViewHours}/>
        <Route exact path="/t" component={TeacherDash}/>
        <Route exact path="/t/hours" component={ViewHours}/>
        <Route exact path="/" component={Login}/>
        <Redirect from="/" to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
