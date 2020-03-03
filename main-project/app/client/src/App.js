import React from 'react';
import './App.css';
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import Login from './Components/Auth/Login';

import StudentDash from './Components/Student/StudentDash';
import AdminDash from './Components/Admin/AdminDash';
import VolunteerDash from './Components/Volunteer/VolunteerDash';
import TeacherDash from './Components/Teacher/TeacherDash';
import StudentGrades from './Components/Student/GradesView';

class App extends React.Component {
  constructor(props) {
    super(props);
    /* For local debugging */
    const DEBUG = 0;

    /* Debug variables.*/
    const PREFIX = DEBUG ? "http://localhost:80" : "";

    this.state = {
      prefix: PREFIX
    };
  }

  render() {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path="/s" component={StudentDash} state={this.state}/>
            <Route exact path="/s/grades" component={StudentGrades} state={this.state}/>
            <Route exact path="/a" component={AdminDash} state={this.state}/>
            <Route exact path="/v" component={VolunteerDash} state={this.state}/>
            <Route exact path="/t" component={TeacherDash} state={this.state}/>
            <Route exact path="/" component={Login} state={this.state}/>
            <Redirect from="/" to="/"/>
          </Switch>
        </BrowserRouter>
    );
  }
}

export default App;
