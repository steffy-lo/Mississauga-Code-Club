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
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //       <h6>Use <i>npm run build</i> to rebuild for redeloyment</h6>
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
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
