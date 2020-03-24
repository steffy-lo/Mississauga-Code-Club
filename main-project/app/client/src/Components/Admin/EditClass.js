import React from 'react';
import { Link } from 'react-router-dom';
import { uid } from 'react-uid';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';
import ActiveNotification from '../Util/ActiveNotification';

import { getUserTypeExplicit } from '../../Actions/utility.js';
import { getClass, updateCourseInfo, addStudent, addTeacher } from '../../Actions/admin';

import "../CSS/Admin/EditClass.css";
import "../CSS/Common.css";

class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.class_id;
    this.state = {
      modalWindow: "",
      actionDisplay: "",
      //Teachers
      teacherList: [],
      //Students
      studentList: [],
      //Volunteers
      volunteerList: [],
      //Criteria
      criteriaList: [],
      courseTitle: "",
      activeCourse: true,

      studentEmail: "",

      teacherEmail: ""
    };
    this.resetChanges = () => null;
  }

  componentDidMount() {
    this.getClassData();
  }

  getClassData() {
    this.setState({modalWindow: <LoadingModal text="Getting class data ..."/>});
    getClass(this.id)
    .then(classData => {
      console.log(classData);
      const critList = [];
      Object.keys(classData.markingSections).forEach((key) => critList.push(
        {
          criterion: key,
          details: classData.markingSections[key]
        }
      ));
      this.setState({
        modalWindow: "",
        courseTitle: classData.courseTitle,
        activeCourse: classData.ongoing,
        teacherList: classData.instructors,
        studentList: classData.students,
        criteriaList: critList
      })
    })
    .catch(err => {
      console.log(err);
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
        setTimeout(() => this.props.history.push('/a/class'), 1000);
      }
    })
  }

  render() {
    return(
      <React.Fragment>
        {this.state.actionDisplay}
        {this.state.modalWindow}
        <NavbarGeneric/>
          <div className="absolute fillContainer flex verticalCentre">
            <div className="flex horizontalCentre">
              <div className="flex verticalCentre" id="editClassPreWrapper">
                <h1>
                  Edit Class
                </h1>
                <div id="editClassMain" className="flex horizontalCentre">
                  <div id="editClassMainL">
                    <h2>
                    Class Details:
                    </h2>
                    <div
                    className="flexCol"
                    >
                      <div className="singleEntry2Spaced">
                        <span>Class ID#:&nbsp;
                          <input disabled type="text"
                          value={this.id}
                          />
                        </span>
                        <span className="flex verticalCentre">
                          <span>
                            <input type="radio"
                            checked={this.state.activeCourse === true}
                            value={1}
                            onChange={e => this.setState({activeCourse: true})} />
                            &nbsp;Active
                          </span>
                          <span>
                            <input type="radio"
                            checked={this.state.activeCourse === false}
                            value={0}
                            onChange={e => this.setState({activeCourse: false})} />
                            &nbsp;Inactive
                          </span>
                        </span>
                      </div>
                    </div>
                    <div id="ecCourseTitle">Class Title:&nbsp;
                      <input type="text"
                      value={this.state.courseTitle}
                      onChange={e => {
                        this.setState({courseTitle: e.target.value})}
                      }
                      />
                    <button onClick={ e=> {
                        this.setState({
                          modalWindow: <LoadingModal text="Updating course info ..." />
                        })
                        updateCourseInfo(this.id, this.state.activeCourse, this.state.courseTitle)
                        .then(() => {
                          this.setState({modalWindow: ""})
                        })
                        .catch(err => {
                          console.log(err);
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
                                <StatusModal title="Update Unsuccesfsul"
                                  text={err.msg}
                                  onClose={() => this.setState({modalWindow: ""})}/>
                            })
                          }
                        })
                      }}>
                      Save Details
                    </button>
                    </div>
                    <div>
                      <h3>
                        Criteria:
                      </h3>
                      <div id="critScroll" className="vScrollable">
                        <table>
                        <thead>
                          <tr>
                            <th>Criterion</th>
                            <th>Points</th>
                            <th>Index</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.generateCriteriaList()}
                        </tbody>
                        </table>
                      </div>

                      <form className="ecBarAdd">
                        {/*}<input type="text"
                        placeholder="criterion title"
                        />
                        <input type="number"
                        placeholder="weight"
                        />
                        <input type="number"
                        placeholder="index"
                        />
                        <input type="submit"
                        value="Add Criterion"
                        onClick={e => {
                          e.preventDefault();
                        }}
                        />*/}
                      </form>
                    </div>
                  </div>

                  <div id="editClassMainC">
                    <h2>
                      Teachers:
                    </h2>
                    <div id="tchLstW" className="flexCol">
                      <div id="tchLst" className="vScrollable fill">
                        {this.generateTeacherList()}
                      </div>
                    </div>
                    <form className="ecBarAdd">
                      <input type="email"
                      placeholder="teacher Email"
                      value={this.state.teacherEmail}
                      onChange={e => this.setState({teacherEmail: e.target.value})}
                      />
                      <input type="submit"
                      value="Add Teacher"
                      onClick={e => {
                        e.preventDefault();
                        addTeacher(this.state.teacherEmail, this.id)
                        .then(() => {
                          const trEm = this.state.teacherEmail;
                          const stList = this.state.teacherList;
                          stList.push(trEm)
                          this.setState({
                            modalWindow: "",
                            teacherList: stList
                          })
                        })
                        .catch(err => {
                          this.setState({
                            modalWindow:
                              <StatusModal title="Could Not Add Teacher"
                                text={err.msg}
                                onClose={e => this.setState({modalWindow: ""})}
                                />
                          })
                        })
                      }}
                      />
                    </form>
                  </div>


                  <div id="editClassMainR">
                    <h2>
                      Students:
                    </h2>
                    <div id="stdLstW" className="flexCol">
                      <div id="stdLst" className="vScrollable fill">
                        {this.generateStudentList()}
                      </div>
                    </div>
                    <form className="ecBarAdd">
                      <input type="email"
                      placeholder="student email"
                      value={this.state.studentEmail}
                      onChange={e => this.setState({studentEmail: e.target.value})}
                      />
                      <input type="submit"
                      value="Add Student"
                      onClick={e => {
                        e.preventDefault();
                        addStudent(this.state.studentEmail, this.id)
                        .then(() => {
                          const stdEm = this.state.studentEmail;
                          const stList = this.state.studentList;
                          stList.push(stdEm)
                          this.setState({
                            modalWindow: "",
                            studentList: stList
                          })
                        })
                        .catch(err => {
                          this.setState({
                            modalWindow:
                              <StatusModal title="Could Not Add Student"
                                text={err.msg}
                                onClose={e => this.setState({modalWindow: ""})}
                                />
                          })
                        })
                      }}
                      />
                    </form>
                  </div>

                  {/*<div id="editClassMainR">
                    <h2>
                      Volunteers:
                    </h2>
                    <div id="stdLstW" className="flexCol">
                      <div id="stdLst" className="vScrollable fill">
                        {this.generateStudentList()}
                      </div>
                    </div>
                    <form className="ecBarAdd">
                      <input type="email"
                      placeholder="student email"
                      value={this.state.studentEmail}
                      onChange={e => this.setState({studentEmail: e.target.value})}
                      />
                      <input type="submit"
                      value="Add Student"
                      onClick={e => {
                        e.preventDefault();
                        addStudent(this.state.studentEmail, this.id)
                        .then(() => {
                          const stdEm = this.state.studentEmail;
                          const stList = this.state.studentList;
                          stList.push(stdEm)
                          this.setState({
                            modalWindow: "",
                            studentList: stList
                          })
                        })
                        .catch(err => {
                          this.setState({
                            modalWindow:
                              <StatusModal title="Could Not Add Student"
                                text={err.msg}
                                onClose={e => this.setState({modalWindow: ""})}
                                />
                          })
                        })
                      }}
                      />
                    </form>
                  </div>*/}
                  
                </div>
              </div>
            </div>
          </div>
      </React.Fragment>
    );
  }

  generateStudentList(selector) {
    const compiledList = [];
    for(let email of this.state.studentList) {
      compiledList.push(
        <div className="ecEmailEntry" key={email}>
          <p>{email}</p>
          {/*}<button
          onClick={e => {
            const changed = this.state.studentList;
            changed.forEach((ei, i) => {
              if (ei === email) changed.splice(i, 1);
            });
            this.setState({studentList: changed});
            }}>
            Delete
          </button>*/}
        </div>
      );
    }
    return compiledList;
  }

  generateTeacherList() {
    const compiledList = [];
    for(let email of this.state.teacherList) {
      compiledList.push(
        <div className="ecEmailEntry" key={email}>
          <p>{email}</p>
          {/*}<button
          onClick={e => {
            const changed = this.state.teacherList;
            changed.forEach((ei, i) => {
              if (ei === email) changed.splice(i, 1);
            });
            this.setState({teacherList: changed});
          }}>
            Delete
          </button>*/}
        </div>
      );
    }
    return compiledList;
  }

  generateCriteriaList() {
    const compiledList = [];
    const criteria = this.state.criteriaList
    for(let entry of criteria) {
      compiledList.push(
        <tr key={entry.criterion}>
          <td>{entry.criterion}</td>
          <td>{entry.details.weight}</td>
          <td>
            {entry.details.index}
            {/*}<button className="ecDeleteButton"
            onClick={e => {
              const changed = this.state.criteriaList;
              delete changed[entry];
              this.setState({
                criteriaList: changed
              });
            }}
            >
              Delete
            </button>*/}
          </td>
        </tr>
      );
    }
    return compiledList;
  }


}
export default EditClass;
