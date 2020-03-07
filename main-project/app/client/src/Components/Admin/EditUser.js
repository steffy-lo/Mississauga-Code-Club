import React from 'react';
import { Link } from 'react-router-dom';
import { uid } from 'react-uid';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { getUserTypeExplicit } from '../../Actions/utility.js';

import "../CSS/Admin/EditUser.css";
import "../CSS/Common.css";

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.state = {
      modalWindow: "",

      userType: 1,
      firstName: "",
      lastName: "",
      email: "",
      telephone: "",
      parentEmail: "",
      password: "",
      changePassword: 0,
      isStudent: 0
    };
    this.resetChanges = () => null;
  }

  render() {
    return(
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric/>
          <div className="absolute fillContainer flex verticalCentre">
            <div className="flex horizontalCentre">
              <form id="singleUserEditMainWindow">
                <h1>Edit User</h1>
                <div id="sueIDUserType">
                  <span>ID#:&nbsp;
                    <input type="text" value={this.id} disabled />
                  </span>
                  <span>User Type:&nbsp;
                    <select
                    disabled
                    value={this.state.userType}
                    id="sueUserTypeSelect"
                    onChange={e => this.setState({userType: e.target.value})}
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
                    <span>First Name:&nbsp;
                      <input type="text" value={this.state.firstName}
                      onChange={e => this.setState({firstName: e.target.value})}/>
                    </span>
                    <span>Surname:&nbsp;
                      <input type="text" value={this.state.lastName}
                      onChange={e => this.setState({lastName: e.target.value})}/>
                    </span>
                    <span>Age:&nbsp;
                      <input disabled={!this.state.isStudent}
                      type="text" value={this.state.age}
                      onChange={e => this.setState({age: e.target.value})}/>
                    </span>
                  </div>
                  <div id="ssfwRight">
                    <span>Email:&nbsp;
                      <input type="text" value={this.state.firstName}
                      onChange={e => this.setState({firstName: e.target.value})}/>
                    </span>
                    <span>Phone #:&nbsp;
                      <input type="tel" value={this.state.lastName}
                      onChange={e => this.setState({lastName: e.target.value})}/>
                    </span>
                    <span>Parent Email:&nbsp;
                      <input disabled={!this.state.isStudent}
                      type="text" value={this.state.parentEmail}
                      onChange={e => this.setState({parentEmail: e.target.value})}/>
                    </span>
                  </div>
                </div>
                <div id="suePasswordField">
                  <span>Change Password?&nbsp;&nbsp;
                    <input type="checkbox" onChange={e =>  {
                      this.setState({changePassword: !this.state.changePassword});
                    }}/>
                    {/* For vertical-centering of what comes before this. */}
                    <input type="text" className="hidden" style={{width: 0}}/>
                  </span>
                  <input type="password"
                  placeholder="new password"
                  disabled={!this.state.changePassword}/>
                </div>
                <div id="sueButtonField">
                  <button>Save Changes</button>
                  <input type="reset" value="Reset Changes"/>
                </div>
              </form>
            </div>
          </div>
      </React.Fragment>
    );
  }
}
export default EditUser;
