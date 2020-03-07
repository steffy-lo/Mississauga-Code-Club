import React from 'react';
import { Link } from 'react-router-dom';
import { uid } from 'react-uid';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { getUserTypeExplicit } from '../../Actions/utility.js';

import "../CSS/Admin/SelectUser.css";
import "../CSS/Common.css";

class SelectClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalWindow: "",
      onGoing: 1,
      classList: []
    };
  }

  componentDidMount() {
    this.setState({
      classList: [
        {courseTitle: "Python", class_id: "31", ongoing: 1},
        {courseTitle: "Python", class_id: "32", ongoing: 1},
        {courseTitle: "Python", class_id: "33", ongoing: 1},
        {courseTitle: "Python", class_id: "34", ongoing: 1},
        {courseTitle: "Python", class_id: "35", ongoing: 1},
        {courseTitle: "Python", class_id: "36", ongoing: 1},
        {courseTitle: "Python", class_id: "37", ongoing: 1},
        {courseTitle: "Python", class_id: "38", ongoing: 1},
        {courseTitle: "Python", class_id: "39", ongoing: 1},
        {courseTitle: "Python", class_id: "311", ongoing: 1},
        {courseTitle: "Python", class_id: "312", ongoing: 1},
        {courseTitle: "Python", class_id: "313", ongoing: 1},
        {courseTitle: "Python", class_id: "314", ongoing: 1},
        {courseTitle: "Python", class_id: "315", ongoing: 1},
        {courseTitle: "Python", class_id: "325", ongoing: 1},
        {courseTitle: "Python", class_id: "326", ongoing: 1},
        {courseTitle: "Python", class_id: "316", ongoing: 1},
        {courseTitle: "Python", class_id: "317", ongoing: 1},
        {courseTitle: "Python", class_id: "431", ongoing: 0},
        {courseTitle: "Python", class_id: "432", ongoing: 0},
        {courseTitle: "Python", class_id: "433", ongoing: 0},
        {courseTitle: "Python", class_id: "434", ongoing: 0},
        {courseTitle: "Python", class_id: "435", ongoing: 0},
        {courseTitle: "Python", class_id: "436", ongoing: 0},
        {courseTitle: "Python", class_id: "437", ongoing: 0},
        {courseTitle: "Python", class_id: "438", ongoing: 0},
        {courseTitle: "Python", class_id: "439", ongoing: 0},
        {courseTitle: "Python", class_id: "4311", ongoing: 0},
        {courseTitle: "Python", class_id: "4312", ongoing: 0},
        {courseTitle: "Python", class_id: "4313", ongoing: 0},
        {courseTitle: "Python", class_id: "4314", ongoing: 0},
        {courseTitle: "Python", class_id: "4315", ongoing: 0},
        {courseTitle: "Python", class_id: "4316", ongoing: 0},
        {courseTitle: "Python", class_id: "4317", ongoing: 0},
        {courseTitle: "C# (C-Sharp)", class_id: "43", ongoing: 0}
      ]
    });
    /*
    getAllClasses().
    then(res => {

    })
    .catch(e => {
      if (e.status === 404) {
        console.log("404");
      } else {
        this.setState({
          modalWindow: <StatusModal
                        title="Error: Could not reach server"
                        text="Please try again later"
                        onClose={() => {
                          this.props.history.push("/a/");
                        }}/>
        })
      }
    }
    }
    })
    */
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
                onClick={e => this.setState({onGoing: 1})}
                className={this.state.onGoing === 1 ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwTeachers">
                  Ongoing Classes
                </button>
                <button
                onClick={e => this.setState({onGoing: 0})}
                className={this.state.onGoing === 0 ?
                  "sumwpwSelected" : "sumwpwNotSelected" }
                id="sumwpwAdmins">
                  Completed Classes
                </button>
              </div>

              <div id="selectUserMainWindow">
                <h1>Select a Class</h1>
                <p><i>Click on a class to view and modify its information</i></p>
                <div id="selectUserScrollableListB">
                  {this.generateSelectionList()}
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
          <Link
            className=
            {
              `${classEntry.ongoing ? "sluTeacher": "sluAdmin"}`
            }
            to={`/a/class/${classEntry.class_id}`}
            key={classEntry.class_id}>
            {classEntry.courseTitle}
          </Link>
        );
      }
    }
    return compiledList;
  }

}


export default SelectClass;
