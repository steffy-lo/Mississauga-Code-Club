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
      userList: []
    };
  }

  componentDidMount() {
    this.setState({
      userList:
      [
        {
          email: "jack@black.hack",
          firstName: "Jack",
          lastName: "Black",
          userType: 3
        },
        {
          email: "flack@black.hack",
          firstName: "Flack",
          lastName: "Black",
          userType: 4
        },
        {
          email: "sack@black.hack",
          firstName: "Sack",
          lastName: "Black",
          userType: 4
        },
        {
          email: "Shack@black.hack",
          firstName: "Shack",
          lastName: "Black",
          userType: 2
        },
        {
          email: "Ark1@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark2@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark3@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark4@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark5@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark6@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark7@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark8@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark9@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark11@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark12@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark13@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark14@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark15@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark16@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },
        {
          email: "Ark17@black.hack",
          firstName: "Ark",
          lastName: "Black",
          userType: 1
        },

      ]
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
                onClick={e => this.setState({selectedType: 4})}
                className={this.state.selectedType === 4 ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwStudents">
                  Students
                </button>
                <button
                onClick={e => this.setState({selectedType: 3})}
                className={this.state.selectedType === 3 ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwVolunteers">
                  Volunteers
                </button>
                <button
                onClick={e => this.setState({selectedType: 2})}
                className={this.state.selectedType === 2 ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwTeachers">
                  Teachers
                </button>
                <button
                onClick={e => this.setState({selectedType: 1})}
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
                  <thead>
                  <tr>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                  </tr>
                  </thead>
                  <tbody>
                    {this.generateHoursRows()}
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

  generateHoursRows() {
    const compiledList = [];
    if (!this.state.userList) {
      return(
        <tr>
          <td>No users found</td>
        </tr>
      )
    }
    for (let userEntry of this.state.userList) {
      if (this.state.selectedType === userEntry.userType) {
        compiledList.push(
          this.generateHourRow(userEntry.email, userEntry.firstName,
            userEntry.lastName, userEntry.userType)
        );
      }
    }
    return compiledList;
  }

  generateHourRow(email, firstName, lastName, userType) {
    return (
      <tr
      key={email}
      className={
        `slu${
          ["Admin", "Teacher", "Volunteer", "Student"][userType-1]
        }`
      }
      onClick={e => this.props.history.push(`/a/user/${email}`)}
      >
        <td>
          {email}
        </td>
        <td>
          {firstName}
        </td>
        <td>
          {lastName}
        </td>
      </tr>
    );
  }

}


export default SelectUser;
