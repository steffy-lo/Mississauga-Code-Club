import React from 'react';
import { Link } from 'react-router-dom';
import { uid } from 'react-uid';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { getUserTypeExplicit } from '../../Actions/utility.js';

import "../CSS/Admin/SelectUser.css";
import "../CSS/Common.css";

class SelectUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalWindow: "",
      selectedType: 4,
      userList: ""
    };
  }

  changeSelection(newSelection) {
    this.setState({
      selectedType: newSelection
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric />
        <div className="absolute fillContainer flex verticalCentre">
          <div className={"flex horizontalCentre"}>
            <div id="selectUserMainWindowPW">

              <div id="sumwpwTypeSelector">
                <button
                onClick={e => this.changeSelection(4)}
                className={this.state.selectedType === 4 ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwStudents">
                  Students
                </button>
                <button
                onClick={e => this.changeSelection(3)}
                className={this.state.selectedType === 3 ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwVolunteers">
                  Volunteers
                </button>
                <button
                onClick={e => this.changeSelection(2)}
                className={this.state.selectedType === 2 ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwTeachers">
                  Teachers
                </button>
                <button
                onClick={e => this.changeSelection(1)}
                className={this.state.selectedType === 1 ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwAdmins">
                  Admins
                </button>
              </div>

              <div id="selectUserMainWindow">
                <h1>Select a User</h1>
                <p><i>Click on a user to view and edit their information</i></p>
                <div id="selectUserScrollableList">
                  <table>
                  <tbody>
                    {this.state.userList}
                  </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class UserRow extends React.Component {
  constructor(props) {
    super(props);
    this.email = props.email;
    this.firstName = props.fName;
    this.lastName = props.lName;
    this.url = "/a/user/"
  }

  render() {
    return (
      <tr onClick={e => console.log(this.url + this.email)}>
        <td>
          {this.email}
        </td>
        <td>
          {this.firstName}
        </td>
        <td>
          {this.lastName}
        </td>
      </tr>
    );
  }
}


export default SelectUser;
