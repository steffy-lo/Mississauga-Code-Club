import React from "react";
import { Link } from "react-router-dom";

import NavbarGeneric from "../Util/NavbarGeneric";
import CreateClass from "./CreateClass";

import HelpButton from "../Util/HelpButton";

import "../CSS/Admin/Dashboard.css";
import "../CSS/Common.css";

/**
 * Dashboard view for admins.
 * Links to the various functional views accessible to admins.
 * @extends React
 */
class AdminDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalWindow: ""
    };
  }

  render() {
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric
	    help={
                <HelpButton
                text={
                        <div>
			This page allows you to access various administration related functions.
			<br />
			To create a new class, either import a spreadsheet or click create new classes and enter a class name.

		        </div>
			}


                      parentForClose = {this}
                    />
		}/>
        <div className="flexContentContainerGeneric">
          <div className="absolute flex verticalCentre">
            <div id="aDashWelcomeTag">Welcome to the Admin Dashboard</div>
            <div
              id="ADashMainWrapper"
              className="flex horizontalCentre reverseWrap"
            >

              {/*Shared functionality (i.e. "teacher-like" functionality).*/}
              <div id="mADwSLeft" className="mainADashWindowS">
                <h2>Your Information</h2>
                <Link to="/a/hours">View &amp; Manage Your Hours</Link>
                <Link to="/a/courses">View &amp; Manage Your Classes</Link>
              </div>

              {/*Admin specific functionality.*/}
              <div className="mainADashWindowS">
                <h2>Administration</h2>
                <Link to="/a/checkin">Check-In Page</Link>
                <Link to="/a/user">Manage Users &amp; Data</Link>
                <Link to="/a/class">Manage Classes</Link>
                <Link to="/a/c/user">Create New Users</Link>
                <Link to="/a/import">Import Classes from Files</Link>

                {/*Create class (Modal, rather than a link)*/}
                <span
                  id="adashnewClasses"
                  onClick={e => {
                    this.setState({
                      modalWindow: (
                        <CreateClass
                          onClose={() => {
                            this.setState({ modalWindow: "" });
                          }}
                        />
                      )
                    });
                  }}
                >
                  Create New Classes
                </span>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminDash;
