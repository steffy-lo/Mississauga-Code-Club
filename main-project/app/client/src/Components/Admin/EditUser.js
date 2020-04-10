import React from "react";
import { Link } from "react-router-dom";

import NavbarGeneric from "../Util/NavbarGeneric";
import StatusModal from "../Util/StatusModal";
import LoadingModal from "../Util/LoadingModal";
import { STD_LOG, STD_STAT, STD_RELOAD } from "../Util/PrebuiltModals";

import HelpButton from "../Util/HelpButton";

import {
  getUserTypeExplicit,
  genUniversalDate
} from "../../Actions/utility.js";
import { getUser, editUser } from "../../Actions/admin";

import "../CSS/Admin/EditUser.css";
import "../CSS/Common.css";

/**
 * View for modifying an existing user.
 * FUNCTIONALITY: Edit an existing user. USER TYPE changing currently DISABLED.
 *  SIMILARITY: CreateClass.
 *  For more information, see CreateClass.
 *
 * CONTEXT: Admin use only.
 * DEMANDS URL PARAMETER: "email".
 *  USED to target a certain user for modification
 *  (to retrieve and modify their data)
 *
 * @extends React
 */
class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.email = props.match.params.email;
    this.state = {
      modalWindow: "",

      userType: 1,
      firstName: "",
      lastName: "",
      telephone: "",
      parentEmail: "",
      birthday: "",
      changePassword: 0,
      password: "",
      isStudent: 0,
      parentName: ""
    };
  }

  componentDidMount() {
    this.getUserDetails();
  }

  /* See Create Class */
  getUserDetails() {
    this.setState({
      modalWindow: <LoadingModal text="Getting user data ..." />
    });

    /* See Create Class.  */
    getUser(this.email)
      .then(user => {
        console.log(user);
        const birthdate = genUniversalDate(new Date(user.birthday));
        this.setState({
          modalWindow: "",
          userType: user.userType,
          firstName: user.firstName,
          lastName: user.lastName,
          telephone: user.phoneNumber,
          isStudent: user.userType == 4 ? 1 : 0,
          birthday: birthdate,
          parentEmail: user.userType == 4 ? user.parentEmail : "",
          parentName: user.userType == 4 ? user.parentName : ""
        });
      })
      .catch(err => {
        this.setState({ modalWindow: "" });
        if (err.stat === 403) {
          STD_LOG(this);
        } else {
          STD_RELOAD(err.msg, this, () => this.props.history.push("/a/user"))
        }
      });
  }

  /**
   * Save the changes to this user's data.
   * @return {void}
   */
  editUser() {
    /* See ACTIONS:admin.js, editUser for more information. */
    editUser(this.email, this.state)
      .then(() => {
        //Success: Alert the user.
        this.setState({
          modalWindow: (
            <StatusModal
              title="User Editing Successful"
              text={`Changes were successfully applied to ${this.email}.`}
              onClose={() => this.setState({ modalWindow: "" })}
            />
          )
        });
      })
      .catch(err => {
        this.setState({ modalWindow: "" });
        if (err.stat === 403) STD_LOG(this);
        else if (err.stat === 404) {
          // Forced removal from page, if this user does not exist.
          // "If there is nothing to see, then there is no reason for the user to be here"
          STD_RELOAD(err.msg, this, () => this.props.history.push("/a/user"));
        } else STD_STAT("User Editing Unsuccesfsul", err.msg, this);
      });
  }

  render() {
    const navList = [
      { tag: "Dashboard", link: "/a/" },
      { tag: "Select a User", link: "/a/user" },
      { tag: `Edit User: ${this.email}` }
    ];
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric
          crumbs={navList}
          help={
            <HelpButton
              text={
                <div>
                  This page allows you to edit properties of existing users.
                </div>
              }
              parentForClose={this}
            />
          }
        />
        <div className="flexContentContainerGeneric">
          <div className="flex horizontalCentre">
            {/*
              The main window for editUser.
            */}
            <form id="singleUserEditMainWindow">
              <h1>Edit User</h1>
              {/* The user email itself. Changed disabled for obvious reasons */}
              <div id="sueIDUserType">
                <span>
                  Email:&nbsp;
                  <input type="text" value={this.email} disabled />
                </span>
                <span>
                  User Type:&nbsp;
                  <select
                    disabled
                    value={this.state.userType}
                    id="sueUserTypeSelect"
                    onChange={e => this.setState({ userType: e.target.value })}
                  >
                    <option value="1">Administrator</option>
                    <option value="2">Teacher</option>
                    <option value="3">Volunteer</option>
                    <option value="4">Student</option>
                  </select>
                </span>
              </div>
              <div id="sueStandardFieldsWrapper">
                <div id="ssfwLeft">
                  <span>
                    First Name:&nbsp;
                    <input
                      type="text"
                      value={this.state.firstName}
                      onChange={e =>
                        this.setState({ firstName: e.target.value })
                      }
                    />
                  </span>
                  <span>
                    Surname:&nbsp;
                    <input
                      type="text"
                      value={this.state.lastName}
                      onChange={e =>
                        this.setState({ lastName: e.target.value })
                      }
                    />
                  </span>
                  <span>
                    Birthday:&nbsp;
                    <input
                      disabled={!this.state.isStudent}
                      type="date"
                      value={this.state.birthday}
                      onChange={e =>
                        this.setState({ birthday: e.target.value })
                      }
                    />
                  </span>
                </div>
                <div id="ssfwRight">
                  <span>
                    <input style={{ visibility: "hidden" }} type="text" />
                  </span>
                  <span>
                    Phone #:&nbsp;
                    <input
                      type="tel"
                      value={this.state.telephone}
                      onChange={e =>
                        this.setState({ telephone: e.target.value })
                      }
                    />
                  </span>
                  <span>
                    Parent Email:&nbsp;
                    <input
                      disabled={!this.state.isStudent}
                      type="text"
                      value={this.state.parentEmail}
                      onChange={e =>
                        this.setState({ parentEmail: e.target.value })
                      }
                    />
                  </span>
                  <span>
                    Parent Name:&nbsp;
                    <input
                      disabled={!this.state.isStudent}
                      type="text"
                      value={this.state.parentName}
                      onChange={e =>
                        this.setState({ parentName: e.target.value })
                      }
                    />
                  </span>
                </div>
              </div>
              <div id="suePasswordField">
                  <span>
                    Change Password?&nbsp;&nbsp;
                    <input type="checkbox" onChange={e =>  {
                      this.setState({changePassword: !this.state.changePassword});
                    }} />
                  {/* For vertical-centering of what comes before this. */}
                    <input type="text" className="hidden" style={{width: 0}} />
                  </span>
                  <input type="password"
                  placeholder="new password"
                  disabled={!this.state.changePassword}
                  onChange={e => this.setState({ password: e.target.value})} />
              </div>
              <div id="sueButtonField">
                <button
                  onClick={e => {
                    e.preventDefault();
                    this.editUser();
                  }}
                >
                  Save Changes
                </button>
                <input
                  type="reset"
                  value="Reset Changes"
                  onClick={e => {
                    e.preventDefault();
                    this.getUserDetails();
                  }}
                />
                <Link
                  to={`/a/hours/${this.email}`}
                  style={{ display: this.state.isStudent ? "none" : "inherit" }}
                >
                  Edit Hours
                </Link>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default EditUser;
