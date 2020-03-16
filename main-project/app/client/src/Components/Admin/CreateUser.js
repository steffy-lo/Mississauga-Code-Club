import React from 'react';
import { Link } from 'react-router-dom';
import { uid } from 'react-uid';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { getUserTypeExplicit } from '../../Actions/utility.js';
import { createUser } from "../../Actions/admin";

import "../CSS/Admin/EditUser.css";
import "../CSS/Common.css";

class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalWindow: "",
      userType: 4,
      firstName: "",
      lastName: "",
      email: "",
      telephone: "",
      parentEmail: "",
      parentName: "",
      birthday: "",
      password: "",
      isStudent: 1
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
                <h1>Create New User</h1>
                <div id="sueIDUserType">
                  <span>Email:&nbsp;
                    <input required type="email"
                    value={this.state.email}
                    onChange={e => this.setState({email: e.target.value})}
                    />
                  </span>
                  <span>User Type:&nbsp;
                    <select
                    value={this.state.userType}
                    id="sueUserTypeSelect"
                    onChange={e => {
                      this.setState({
                        userType: parseInt(e.target.value),
                        isStudent: e.target.value === "4"
                      });
                    }}
                    >
                      <option value="4">Student</option>
                      <option value="1">Administrator</option>
                      <option value="2">Teacher</option>
                      <option value="3">Volunteer</option>
                    </select>
                  </span>
                </div>
                <div id="sueStandardFieldsWrapper">
                  <div id="ssfwLeft">
                    <span>First Name:&nbsp;
                      <input required type="text" value={this.state.firstName}
                      onChange={e => this.setState({firstName: e.target.value})}/>
                    </span>
                    <span>Surname:&nbsp;
                      <input required type="text" value={this.state.lastName}
                      onChange={e => this.setState({lastName: e.target.value})}/>
                    </span>
                    <span>Birthday:&nbsp;
                      <input disabled={!this.state.isStudent}
                      type="date" value={this.state.birthday}
                      onChange={e => this.setState({birthday: e.target.value})}/>
                    </span>
                  </div>
                  <div id="ssfwRight">
                    {/*<span>Email:&nbsp;
                      <input type="text" value={this.state.firstName}
                      onChange={e => this.setState({firstName: e.target.value})}/>
                    </span>*/}
                    <span>Phone #:&nbsp;
                      <input type="tel" value={this.state.telephone}
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      onChange={e => this.setState({telephone: e.target.value})}/>
                    </span>
                    <span>
                    Password:&nbsp;
                    <input type="password"
                    placeholder=""
                    value={this.state.password}
                    onChange={e => this.setState({password: e.target.value})}
                    />
                    </span>
                    <span>Parent Name:&nbsp;
                      <input disabled={!this.state.isStudent}
                      type="text" value={this.state.parentName}
                      onChange={e => this.setState({parentName: e.target.value})}/>
                    </span>
                    <span>Parent Email:&nbsp;
                      <input disabled={!this.state.isStudent}
                      type="email" value={this.state.parentEmail}
                      onChange={e => this.setState({parentEmail: e.target.value})}/>
                    </span>
                  </div>
                </div>
                <div id="sueButtonField">
                  <input type="submit" value="Create User"
                    onClick={e => {
                      e.preventDefault();
                      this.setState({
                        modalWindow:
                          <LoadingModal text="Creating User ..." />
                      })
                      createUser(this.state)
                      .then(() => {
                        this.setState({modalWindow: ""});
                        this.setState({
                          modalWindow:
                            <StatusModal title="User Creation Succesful"
                              text={`User ${this.state.email} was created succesfully`}
                              onClose={() => {
                                this.setState({
                                  modalWindow: "",
                                  firstName: "",
                                  lastName: "",
                                  email: "",
                                  telephone: "",
                                  parentEmail: "",
                                  password: "",
                                  age: 8
                                })
                              }}
                            />
                        })
                      })
                      .catch(err => {
                          const clFunc = () => this.setState({modalWindow: ""});
                          if (err.stat === 403) {
                            this.setState({modalWindow: ""});
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
                            this.setState({modalWindow: ""});
                            this.setState({
                              modalWindow:
                                <StatusModal
                                  title="User Creation Failed"
                                  text={err.msg}
                                  onClose={clFunc}
                                />
                            })
                          }
                      })
                    }}/>
                  <input type="reset" value="Clear Form"
                  onClick={e => window.location.reload(0)}/>
                </div>
              </form>
            </div>
          </div>
      </React.Fragment>
    );
  }
}
export default CreateUser;
