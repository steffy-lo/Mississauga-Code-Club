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
              <Link to="/">Manage Users &amp; Data</Link>
              <Link to="/">Manage Classes</Link>
              <Link to="/">Manage Users Hours</Link>
            </div>
            <div className="mainADashWindowS">
              <h2>Recent Hours</h2>
              <div id="mADWStableWrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Class</th>
                      <th>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>a</td>
                      <td>s</td>
                      <td>d</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link>View More Details ...</Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default AdminDash;
