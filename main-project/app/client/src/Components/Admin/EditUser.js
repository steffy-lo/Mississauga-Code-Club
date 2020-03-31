import React from 'react';
import { Link } from 'react-router-dom';
import { uid } from 'react-uid';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { getUserTypeExplicit, genUniversalDate } from '../../Actions/utility.js';
import { getUser, editUser } from '../../Actions/admin';

import "../CSS/Admin/EditUser.css";
import "../CSS/Common.css";

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
      isStudent: 0,
      parentName: ""
    };
  }

  componentDidMount() {
    this.getUserDetails();
  }

  getUserDetails() {
    this.setState({
      modalWindow:
        <LoadingModal text="Getting user data ..." />
    });
    getUser(this.email)
    .then(user => {
      console.log(user)
      const birthdate = genUniversalDate(new Date(user.birthday));
      this.setState({
        modalWindow: "",
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        telephone: user.phoneNumber,
        isStudent: ( user.userType == 4 ? 1 : 0 ),
        birthday: birthdate,
        parentEmail: ( user.userType == 4 ? user.parentEmail : ""),
        parentName: ( user.userType == 4 ? user.parentName : "")
      });
    })
    .catch(err => {
      this.setState({modalWindow: ""})
      if (err.stat === 403) {
        this.setState({
          modalWindow:
            <LoadingModal text={
                <span>
                  Your login has expired
                  <br />
                  Please reauthenticate
                  <br />
                  Singing you out ...
                </span>
            }/>
        })
        setTimeout(() => window.location.reload(0), 1000);
      } else {
        this.setState({
          modalWindow:
            <LoadingModal text={err.msg} />
        })
        setTimeout(() => this.props.history.push('/a/user'), 1000);
      }
    })
  }

  editUser() {
    editUser(this.email, this.state)
    .then(() => {
      this.setState({
        modalWindow:
          <StatusModal title="User Editing Successful"
            text={`Changes were successfully applied to ${this.email}.`}
            onClose={() => this.setState({modalWindow: ""})}
          />
      })
    })
    .catch(err => {
      this.setState({modalWindow: ""})
      if (err.stat === 403) {
        this.setState({
          modalWindow:
            <LoadingModal text={
                <span>
                  Your login has expired
                  <br />
                  Please reauthenticate
                  <br />
                  Singing you out ...
                </span>
            }/>
        })
        setTimeout(() => window.location.reload(0), 1000);
      } else if (err.stat === 404) {
        this.setState({
          modalWindow:
            <LoadingModal text={err.msg} />
        })
        setTimeout(() => this.props.history.push('/a/user'), 1000);
      } else {
        this.setState({
          modalWindow:
            <StatusModal title="User Editing Unsuccesfsul"
              text={err.msg}
              onClose={() => this.setState({modalWindow: ""})}
            />
        })
      }
    })
  }

  render() {
    const navList = [
      {tag: "Dashboard", link: "/a/"},
      {tag: 'Select a User', link: '/a/user'},
      {tag: `Edit User: ${this.email}`}
    ];
    return(
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric crumbs={navList}/>
          <div className="flexContentContainerGeneric">
            <div className="flex horizontalCentre">
              <form id="singleUserEditMainWindow">
                <h1>Edit User</h1>
                <div id="sueIDUserType">
                  <span>Email:&nbsp;
                    <input type="text" value={this.email} disabled />
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
                      <input type="text"
                        value={this.state.firstName}
                        onChange={e => this.setState({firstName: e.target.value})}/>
                    </span>
                    <span>Surname:&nbsp;
                      <input type="text" value={this.state.lastName}
                      onChange={e => this.setState({lastName: e.target.value})}/>
                    </span>
                    <span>Birthday:&nbsp;
                      <input disabled={!this.state.isStudent}
                      type="date" value={this.state.birthday}
                      onChange={e => this.setState({birthday: e.target.value})}/>
                    </span>
                  </div>
                  <div id="ssfwRight">
                    <span>
                      <input style={{visibility: "hidden"}} type="text"/>
                    </span>
                    <span>Phone #:&nbsp;
                      <input type="tel" value={this.state.telephone}
                      onChange={e => this.setState({telephone: e.target.value})}/>
                    </span>
                    <span>Parent Email:&nbsp;
                      <input disabled={!this.state.isStudent}
                      type="text" value={this.state.parentEmail}
                      onChange={e => this.setState({parentEmail: e.target.value})}/>
                    </span>
                    <span>Parent Name:&nbsp;
                      <input disabled={!this.state.isStudent}
                      type="text" value={this.state.parentName}
                      onChange={e => this.setState({parentName: e.target.value})}/>
                    </span>
                  </div>
                </div>
                {/*}<div id="suePasswordField">
                  <span>Change Password?&nbsp;&nbsp;
                    <input type="checkbox" onChange={e =>  {
                      this.setState({changePassword: !this.state.changePassword});
                    }}/>
                    {// For vertical-centering of what comes before this.}
                    <input type="text" className="hidden" style={{width: 0}}/>
                  </span>
                  <input type="password"
                  placeholder="new password"
                  disabled={!this.state.changePassword}/>
              </div>*/}
                <div id="sueButtonField">
                  <button onClick={e => {
                    e.preventDefault();
                    this.editUser()
                  }}>
                    Save Changes</button>
                  <input type="reset" value="Reset Changes"
                    onClick={e => {
                      e.preventDefault();
                      this.getUserDetails();
                    }}/>
                    <Link
                      to={`/a/hours/${this.email}`}
                      style={{display: this.state.isStudent ? "none" : "inherit" }}>
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
