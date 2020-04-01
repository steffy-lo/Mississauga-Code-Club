import React from 'react';
import { Link } from 'react-router-dom';

import NavbarGeneric from '../Util/NavbarGeneric';
import CreateClass from './CreateClass';

import "../CSS/Admin/Dashboard.css";
import "../CSS/Common.css";

class AdminDash extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalWindow: ""
    }
  }

  render() {
    return(
      <React.Fragment>
      {this.state.modalWindow}
      <NavbarGeneric/>
      <div className="flexContentContainerGeneric">
        <div className="absolute flex verticalCentre">
          <div id="aDashWelcomeTag">Welcome to the Admin Dashboard </div>
          <div id="ADashMainWrapper" className="flex horizontalCentre reverseWrap">
            <div id="mADwSLeft" className="mainADashWindowS">
              <h2>Your Information</h2>
              <Link to="/a/hours">View &amp; Manage Your Hours</Link>
              <Link to="/a/classes">View &amp; Manage Your Classes</Link>
            </div>
            <div className="mainADashWindowS">
              <h2>Administration</h2>
              <Link to="/a/checkin">Check-In Page</Link>
              <Link to="/a/user">Manage Users &amp; Data</Link>
              <Link to="/a/class">Manage Classes</Link>
              <Link to="/a/c/user">Create New Users</Link>
              <Link to="/a/import">Import Classes from Files</Link>
              <span onClick={e => {
                  this.setState({
                    modalWindow:
                      <CreateClass onClose={
                          () => {this.setState({modalWindow: ""})}
                      }/>
                  });
                }}
                id="adashnewClasses">
                Create New Classes
              </span>
            </div>
          </div>
        </div>
      </div>
      </React.Fragment>
    )
  }
}

export default AdminDash;
