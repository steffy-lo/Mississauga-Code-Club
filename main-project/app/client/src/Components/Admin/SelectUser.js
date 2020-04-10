import React from "react";
import { Link } from "react-router-dom";

import NavbarGeneric from "../Util/NavbarGeneric";
//import StatusModal from '../Util/StatusModal';
import LoadingModal from "../Util/LoadingModal";

//import { getUserTypeExplicit } from '../../Actions/utility.js';
import { getUserList } from "../../Actions/admin";

import "../CSS/Admin/SelectUser.css";
import "../CSS/Common.css";

/**
 * View that display a list of filterable links to edit the information of various users.
 * FUNCTIONALITY: USER selects a type of user to view & they are shown the email,
 * & name of the user to choose (one per row of the table).
 * These are clickable links to the user edit view for that specific user.
 *
 * CONTEXT: Admin use only. For simple selection of a user to modify.
 *
 * @extends React
 */
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
    this.getUsersList();
  }

  getUsersList() {
    this.setState({
      modalWindow: <LoadingModal text="Getting users ..." />
    });
    getUserList()
      .then(userData => {
        console.log(userData);
        this.setState({ modalWindow: "", userList: userData });
      })
      .catch(err => {
        this.setState({ modalWindow: "" });
        this.setState({
          modalWindow: <LoadingModal text={err.msg} />
        });
        setTimeout(() => this.props.history.push("/"), 1000);
      });
  }

  render() {
    const navList = [
      { tag: "Dashboard", link: "/a/" },
      { tag: "Select a User" }
    ];
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric crumbs={navList} />
        <div className="flexContentContainerGeneric">
          <div className={"flex horizontalCentre"}>
            <div id="selectUserMainWindowPW">
              {/* Selector buttons for user types. */}
              <div id="sumwpwTypeSelector">
                <button
                  onClick={e => this.setState({ selectedType: 4 })}
                  className={
                    this.state.selectedType === 4
                      ? "sumwpwSelected"
                      : "sumwpwNotSelected"
                  }
                  id="sumwpwStudents"
                >
                  Students
                </button>
                <button
                  onClick={e => this.setState({ selectedType: 3 })}
                  className={
                    this.state.selectedType === 3
                      ? "sumwpwSelected"
                      : "sumwpwNotSelected"
                  }
                  id="sumwpwVolunteers"
                >
                  Volunteers
                </button>
                <button
                  onClick={e => this.setState({ selectedType: 2 })}
                  className={
                    this.state.selectedType === 2
                      ? "sumwpwSelected"
                      : "sumwpwNotSelected"
                  }
                  id="sumwpwTeachers"
                >
                  Teachers
                </button>
                <button
                  onClick={e => this.setState({ selectedType: 1 })}
                  className={
                    this.state.selectedType === 1
                      ? "sumwpwSelected"
                      : "sumwpwNotSelected"
                  }
                  id="sumwpwAdmins"
                >
                  Admins
                </button>
              </div>

              <div id="selectUserMainWindow">
                <h1>Select a User</h1>
                <p>
                  <i>Click on a user to view and edit their information</i>
                </p>
                <div id="selectUserScrollableList">
                  <table>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                      </tr>
                    </thead>
                    <tbody>{this.generateHoursRows()}</tbody>
                  </table>
                </div>

                <div id="suUCButton">
                  <Link to="/a/c/user">Create A New User</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  /*
    HELPER METHOD:
    Generate the table of user information to be shown from userList in state.
    Respects type of user selected (ex. admin).
    Rerenders on state change (specifically, when the user selected a different
    user type to display).
   */
  generateHoursRows() {
    const compiledList = [];
    for (let userEntry of this.state.userList) {
      if (this.state.selectedType === userEntry.userType) {
        compiledList.push(
          this.generateHourRow(
            userEntry.email,
            userEntry.firstName,
            userEntry.lastName,
            userEntry.userType
          )
        );
      }
    }
    return compiledList;
  }

  /*
    HELPER METHOD: Creates an individual hours table row.
   */
  generateHourRow(email, firstName, lastName, userType) {
    return (
      <tr
        key={email}
        className={`slu${
          ["Admin", "Teacher", "Volunteer", "Student"][userType - 1]
        }`}
        onClick={e => this.props.history.push(`/a/user/${email}`)}
      >
        <td>{email}</td>
        <td>{firstName}</td>
        <td>{lastName}</td>
      </tr>
    );
  }
}

export default SelectUser;
