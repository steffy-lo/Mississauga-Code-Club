import React from 'react';
import './App.css';
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";

import { ARoute, TRoute, VRoute, SRoute, LRoute } from './Components/Util/SecuredRoutes';

import Login from './Components/Auth/Login';

import StudentDash from './Components/Student/StudentDash';
import StudentGrades from './Components/Student/GradesView';

import AdminDash from './Components/Admin/AdminDash';
import CheckIn from './Components/Admin/CheckIn';
import SelectUser from './Components/Admin/SelectUser';
import EditUser from './Components/Admin/EditUser';
import EditHours from './Components/Admin/EditHours';
import CreateUser from './Components/Admin/CreateUser';
import SelectClass from './Components/Admin/SelectClass';
import EditClass from './Components/Admin/EditClass';

import VolunteerDash from './Components/Volunteer/VolunteerDash';

import TeacherDash from './Components/Teacher/TeacherDash';
import ViewHours from './Components/Util/ViewHours';
import TeacherFeedback from './Components/Teacher/FeedbackForm';

import BulkImport from './Components/Admin/BulkImport'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <LRoute exact path="/" component={Login}/>
        <SRoute exact path="/s" component={StudentDash}/>
        <SRoute exact path="/s/grades" component={StudentGrades}/>
        <ARoute exact path="/a" component={AdminDash}/>
        <ARoute exact path="/a/hours" component={ViewHours}/>
        <ARoute exact path="/a/hours/@" component={EditHours}/>
        <ARoute exact path="/a/hours/:email" component={EditHours}/>
        <ARoute exact path="/a/checkin" component={CheckIn}/>
        <ARoute exact path="/a/user" component={SelectUser}/>
        <ARoute exact path="/a/c/user" component={CreateUser}/>
        <ARoute exact path="/a/user/:email" component={EditUser}/>
        <ARoute exact path="/a/class" component={SelectClass}/>
        <ARoute exact path="/a/class/:class_id" component={EditClass}/>
        <VRoute exact path="/v" component={ViewHours}/>
        {/*}<Route exact path="/v/hours" component={ViewHours}/>*/}
        <TRoute exact path="/t" component={TeacherDash}/>
        <TRoute exact path="/t/hours" component={ViewHours}/>
        <TRoute exact path="/t/course=:cid/student=:sid" component={TeacherFeedback}/>

        <Route exact path="/t/import" component={BulkImport} />

        <Redirect from="/" to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
