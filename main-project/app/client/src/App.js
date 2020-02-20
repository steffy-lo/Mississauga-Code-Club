import React from 'react';
import './App.css';
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import Login from './Components/Auth/Login';

import StudentDash from './Components/Student/StudentDash';
import AdminDash from './Components/Admin/AdminDash';
import VolunteerDash from './Components/Volunteer/VolunteerDash';
import TeacherDash from './Components/Teacher/TeacherDash';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        //Only accessible this way for now.
        <Route exact path="/s/" component={StudentDash}/>
        <Route exact path="/a/" component={AdminDash}/>
        <Route exact path="/v/" component={VolunteerDash}/>
        <Route exact path="/t/" component={TeacherDash}/>
        <Route exact path="/" component={Login}/>
        <Redirect from="/" to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
