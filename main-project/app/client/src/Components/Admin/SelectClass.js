import React from 'react';
import { Link } from 'react-router-dom';
import { uid } from 'react-uid';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';
import CreateClass from '../Admin/CreateClass';

import { getUserTypeExplicit } from '../../Actions/utility.js';
import { getClassList } from '../../Actions/admin';

import "../CSS/Admin/SelectUser.css";
import "../CSS/Common.css";

class SelectClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalWindow: "",
      onGoing: true,
      classList: []
    };
  }

  componentDidMount() {
    this.getAllClasses();
  }


  getAllClasses() {
    this.setState({
      modalWindow:
        <LoadingModal text="Getting classes ..." />
    });
    getClassList()
    .then(classData => {
      console.log(classData);
      this.setState({modalWindow: "", classList: classData});
    })
    .catch(err => {
      this.setState({modalWindow: ""});
      this.setState({
        modalWindow:
          <LoadingModal text={err.msg} />
      })
      setTimeout(() => this.props.history.push('/a'), 1000);
    })
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
                onClick={e => this.setState({onGoing: true})}
                className={this.state.onGoing === true ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwTeachers">
                  Ongoing Classes
                </button>
                <button
                onClick={e => this.setState({onGoing: false})}
                className={this.state.onGoing === false ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwAdmins">
                  Completed Classes
                </button>
              </div>

              <div id="selectUserMainWindow">
                <h1>Select a Class</h1>
                <p><i>Click on a class to view and modify its information</i></p>
                <div id="selectUserScrollableList">
                  <table>
                  <thead>
                  <tr>
                    <th>Title</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.generateSelectionList()}
                  </tbody>
                  </table>
                </div>

                <div id="suUCButton">
                  <button onClick={e => {
                      this.setState({
                        modalWindow: <CreateClass onClose={
                            () => {this.setState({modalWindow: ""})}
                        }/>
                      })
                    }}>
                    Create A New Class
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  generateSelectionList() {
    const compiledList = [];
    for (let classEntry of this.state.classList) {
      if (classEntry.ongoing === this.state.onGoing) {
        compiledList.push(
          <tr
            className=
            {
              `${classEntry.ongoing ? "sluTeacher": "sluAdmin"}`
            }
            onClick={e=> {
            this.props.history.push(`/a/class/${classEntry.id}`);
            }}
            key={classEntry.id}>
            <td>
              {classEntry.title}
            </td>
          </tr>
        );
      }
    }
    return compiledList;
  }

}


export default SelectClass;
