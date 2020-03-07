import React from 'react';
import { Link } from 'react-router-dom';

import NavbarGeneric from '../Util/NavbarGeneric';
import CheckIn from './CheckIn';

import "../CSS/Admin/Dashboard.css";
import "../CSS/Common.css";

class AdminDash extends React.Component {
  render() {
    return(
      <React.Fragment>
      <NavbarGeneric/>
        <div className="absolute fillContainer flex verticalCentre">
          <div id="aDashWelcomeTag">Welcome USER NAME </div>
          <div id="ADashMainWrapper" className="flex horizontalCentre">
            <div className="mainADashWindowS">
              <h2>Classes</h2>

            </div>
            <div className="mainADashWindowS">
              <h2>Administration</h2>

              <Link to="/a/checkin">Check-In Page</Link>
              <Link to="/a/user/212">Manage Users &amp; Data</Link>
              <Link to="/">Manage Classes</Link>
              <Link to="/a/hours">View &amp; Manage Your Hours</Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default AdminDash;
