import React from "react";
//import { Link } from "react-router-dom";

import NavbarGeneric from "../Util/NavbarGeneric";
import StatusModal from "../Util/StatusModal";
import LoadingModal from "../Util/LoadingModal";

import HelpButton from "../Util/HelpButton";
//import ActiveNotification from "../Util/ActiveNotification";

import {
  getClass,
  updateCourseInfo,
  addStudent,
  addTeacher,
  addVolunteer,
  removeUserFromClass
} from "../../Actions/admin";

import { setCriterion, removeCriterion } from "../../Actions/teacher";

import "../CSS/Admin/EditClass.css";
import "../CSS/Common.css";

/**
 * View for editing every attribute of a class.
 * FUNCTIONALITY: Change the name, activity, marking section, enrollment and staff
 *  of a given class.
 * EXPECTS URL PROP:
 *  class_id: STRINB | The id of the class being edited.
 *
 * @extends React
 */
class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.class_id;
    this.critObj = {};
    this.state = {
      modalWindow: "",
      // For use with "ActiveNotifications".
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

      teacherEmail: "",

      volunteerEmail: "",

      criterionTitle: "",

      criterionWeight: "",

      criterionIndex: ""
    };
    this.resetChanges = () => null;
  }

  componentDidMount() {
    this.getClassData();
  }

  /* Retireves data for initial state */
  getClassData() {
    this.setState({
      modalWindow: <LoadingModal text="Getting class data ..." />
    });
    /* See ACTIONS:admin.js, getClass for more information */
    getClass(this.id)
      .then(classData => {
        console.log(classData);
        this.critObj = classData.markingSections;
        const critList = [];
        Object.keys(classData.markingSections).forEach(key =>
          critList.push({
            criterion: key,
            details: classData.markingSections[key]
          })
        );
        this.setState({
          modalWindow: "",
          courseTitle: classData.courseTitle,
          activeCourse: classData.ongoing,
          teacherList: classData.instructors,
          studentList: classData.students,
          volunteerList: classData.volunteers,
          criteriaList: critList
        });
      })
      .catch(err => {
        this.setState({ modalWindow: "" });
        if (err.stat === 403) {
          this.setState({
            modalWindow: (
              <LoadingModal
                text={
                  <span>
                    Your login has expired
                    <br />
                    Please reauthenticate
                    <br />
                    Singing you out ...
                  </span>
                }
              />
            )
          });
          setTimeout(() => window.location.reload(0), 1000);
        } else {
          this.setState({
            modalWindow: <LoadingModal text={err.msg} />
          });
          setTimeout(() => this.props.history.push("/a/class"), 1000);
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.actionDisplay}
        {this.state.modalWindow}
        <NavbarGeneric
          crumbs={[
            { tag: "Dashboard", link: "/a/" },
            { tag: "Select a Class", link: "/a/class" },
            { tag: `Class ${this.id}` }
          ]}


	help={
                <HelpButton
                text={
                        <div>
			This page allows you to edit properties of existing classes.
			<br />
			Marking a class inactive makes it show up as completed for students, allowing them to see their marks.
			<br />
			Criterion are the sections that students are marked on.
			<br />
			Points is the how much the section is work.
			<br />
			The index is used to sort it in the report in increasing order. When two criterion have the same index, they are sorted alphabetically.
			<br />
			eg. For loops, index 1 will appear before If statements, index 2 or Goto statements, index 1
		        <br />
			You can add students, instructors, and volunteers to classes by typing their email in and adding them in the appropriate section.

		        </div>
			}


                      parentForClose = {this}
                    />
		}/>/>
        <div className="flexContentContainerGeneric">
          <div className="flex horizontalCentre">
            <div className="flex verticalCentre" id="editClassPreWrapper">
              <h1>Edit Class</h1>
              {/* Main Wrapper */}
              <div id="editClassMain" className="flex horizontalCentre">
                {/*
                  Left-most pane. Contains base class details + marking scheme.
                  Here, the functionality for changing the class name & activity
                  is present, as well as, all of the functionality for
                  modifying the class marking scheme.
                */}
                <div id="editClassMainL">
                  <h2>Class Details:</h2>
                  <div className="flexCol">
                    <div className="singleEntry2Spaced">
                      <span>
                        Class ID#:&nbsp;
                        <input disabled type="text" value={this.id} />
                      </span>
                      <span className="flex verticalCentre">
                        <span>
                          <input
                            type="radio"
                            checked={this.state.activeCourse === true}
                            value={1}
                            onChange={e =>
                              this.setState({ activeCourse: true })
                            }
                          />
                          &nbsp;Active
                        </span>
                        <span>
                          <input
                            type="radio"
                            checked={this.state.activeCourse === false}
                            value={0}
                            onChange={e =>
                              this.setState({ activeCourse: false })
                            }
                          />
                          &nbsp;Inactive
                        </span>
                      </span>
                    </div>
                  </div>
                  <div id="ecCourseTitle">
                    Class Title:&nbsp;
                    <input
                      type="text"
                      value={this.state.courseTitle}
                      onChange={e => {
                        this.setState({ courseTitle: e.target.value });
                      }}
                    />
                    <button
                      onClick={e => {
                        // Class base attribute modification.
                        this.setState({
                          modalWindow: (
                            <LoadingModal text="Updating course info ..." />
                          )
                        });
                        updateCourseInfo(
                          this.id,
                          this.state.activeCourse,
                          this.state.courseTitle
                        )
                          .then(() => {
                            this.setState({ modalWindow: "" });
                          })
                          .catch(err => {
                            console.log(err);
                            this.setState({ modalWindow: "" });
                            if (err.stat === 403) {
                              this.setState({
                                modalWindow: (
                                  <LoadingModal
                                    text={
                                      <span>
                                        Your login has expired
                                        <br />
                                        Please reauthenticate
                                        <br />
                                        Singing you out ...
                                      </span>
                                    }
                                  />
                                )
                              });
                              setTimeout(() => window.location.reload(0), 1000);
                            } else {
                              this.setState({
                                modalWindow: (
                                  <StatusModal
                                    title="Update Unsuccesfsul"
                                    text={err.msg}
                                    onClose={() =>
                                      this.setState({ modalWindow: "" })
                                    }
                                  />
                                )
                              });
                            }
                          });
                      }}
                    >
                      Save Details
                    </button>
                  </div>
                  {/*
                    Marking scheme list: Auto-populated on state change.
                    Also present is functionality for changing this criteria
                    (in the form just below this div).
                  */}
                  <div>
                    <h3>Criteria:</h3>
                    <div id="critScroll" className="vScrollable">
                      <table>
                        <thead>
                          <tr>
                            <th>Criterion</th>
                            <th>Points</th>
                            <th>Index</th>
                          </tr>
                        </thead>
                        <tbody>{this.generateCriteriaList()}</tbody>
                      </table>
                    </div>

                    <form className="ecBarAdd">
                      <input
                        type="text"
                        placeholder="criterion title"
                        value={this.state.criterionTitle}
                        onChange={e =>
                          this.setState({ criterionTitle: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        size="4"
                        placeholder="weight"
                        value={this.state.criterionWeight}
                        onChange={e =>
                          this.setState({ criterionWeight: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        size="4"
                        placeholder="index"
                        value={this.state.criterionIndex}
                        onChange={e =>
                          this.setState({ criterionIndex: e.target.value })
                        }
                      />
                      <input
                        type="submit"
                        value="Set Criterion"
                        onClick={e => {
                          e.preventDefault();
                          setCriterion(
                            this.id,
                            this.state.criterionTitle,
                            this.state.criterionWeight,
                            this.state.criterionIndex
                          )
                            .then(s => {
                              this.critObj[this.state.criterionTitle] = {
                                weight: this.state.criterionWeight,
                                index: this.state.criterionIndex
                              };
                              const critList = [];
                              Object.keys(this.critObj).forEach(key =>
                                critList.push({
                                  criterion: key,
                                  details: this.critObj[key]
                                })
                              );
                              this.setState({
                                criterionTitle: "",
                                criterionWeight: "",
                                criteriaList: critList
                              });
                            })
                            .catch(err => {
                              this.setState({
                                criterionTitle: "",
                                criterionWeight: "",
                                modalWindow: (
                                  <StatusModal
                                    title="Could Not Add Criterion"
                                    text={err.msg}
                                    onClose={e =>
                                      this.setState({ modalWindow: "" })
                                    }
                                  />
                                )
                              });
                            });
                        }}
                      />
                    </form>
                  </div>
                </div>

                {/* Teacher Column */}
                <div id="ECMhFormatWrapper">
                  <div id="editClassMainC">
                    <h2>Teachers:</h2>
                    <div id="tchLstW" className="flexCol">
                      <div id="tchLst" className="vScrollable fill">
                        {this.generateTeacherList()}
                      </div>
                    </div>
                    <form className="ecBarAdd">
                      <input
                        type="email"
                        placeholder="teacher Email"
                        value={this.state.teacherEmail}
                        onChange={e =>
                          this.setState({ teacherEmail: e.target.value })
                        }
                      />
                      <input
                        type="submit"
                        value="Add Teacher"
                        onClick={e => {
                          e.preventDefault();
                          addTeacher(this.state.teacherEmail, this.id)
                            .then(() => {
                              const trEm = this.state.teacherEmail;
                              const stList = this.state.teacherList;
                              stList.push(trEm);
                              this.setState({
                                modalWindow: "",
                                teacherList: stList
                              });
                            })
                            .catch(err => {
                              this.setState({
                                modalWindow: (
                                  <StatusModal
                                    title="Could Not Add Teacher"
                                    text={err.msg}
                                    onClose={e =>
                                      this.setState({ modalWindow: "" })
                                    }
                                  />
                                )
                              });
                            });
                        }}
                      />
                    </form>
                  </div>

                  {/* Student Column */}
                  <div id="editClassMainR">
                    <h2>Students:</h2>
                    <div id="stdLstW" className="flexCol">
                      <div id="stdLst" className="vScrollable fill">
                        {this.generateStudentList()}
                      </div>
                    </div>
                    <form className="ecBarAdd">
                      <input
                        type="email"
                        placeholder="student email"
                        value={this.state.studentEmail}
                        onChange={e =>
                          this.setState({ studentEmail: e.target.value })
                        }
                      />
                      <input
                        type="submit"
                        value="Add Student"
                        onClick={e => {
                          e.preventDefault();
                          addStudent(this.state.studentEmail, this.id)
                            .then(() => {
                              const stdEm = this.state.studentEmail;
                              const stList = this.state.studentList;
                              stList.push(stdEm);
                              this.setState({
                                modalWindow: "",
                                studentList: stList
                              });
                            })
                            .catch(err => {
                              this.setState({
                                modalWindow: (
                                  <StatusModal
                                    title="Could Not Add Student"
                                    text={err.msg}
                                    onClose={e =>
                                      this.setState({ modalWindow: "" })
                                    }
                                  />
                                )
                              });
                            });
                        }}
                      />
                    </form>
                  </div>

                  {/* Volunteer Column */}
                  <div id="editClassMainR2">
                    <h2>Volunteers:</h2>
                    <div id="vltLstW" className="flexCol">
                      <div id="vltLst" className="vScrollable fill">
                        {this.generateVolunteerList()}
                      </div>
                    </div>
                    <form className="ecBarAdd">
                      <input
                        type="email"
                        placeholder="volunteer email"
                        value={this.state.volunteerEmail}
                        onChange={e =>
                          this.setState({ volunteerEmail: e.target.value })
                        }
                      />
                      <input
                        type="submit"
                        value="Add Volunteer"
                        onClick={e => {
                          e.preventDefault();
                          addVolunteer(this.state.volunteerEmail, this.id)
                            .then(() => {
                              const stdEm = this.state.volunteerEmail;
                              const stList = this.state.volunteerList;
                              stList.push(stdEm);
                              this.setState({
                                modalWindow: "",
                                volunteerList: stList
                              });
                            })
                            .catch(err => {
                              this.setState({
                                modalWindow: (
                                  <StatusModal
                                    title="Could Not Add Volunteer"
                                    text={err.msg}
                                    onClose={e =>
                                      this.setState({ modalWindow: "" })
                                    }
                                  />
                                )
                              });
                            });
                        }}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  /**
   * HELPER METHOD
   * Creates the visual list of students.
   * EACH ENTRY WILL HAVE:
   *  i) The student's email
   *  2) A Link to their report for this class.
   *  3) A button that removes them from this class.
   *
   * NOTE: Removal is both client and server side.
   * @return {[<div:JSX>]}         A JSX list of student entries. For use in the associated column of this view.
   */
  generateStudentList() {
    const compiledList = [];
    for (let email of this.state.studentList) {
      compiledList.push(
        <div className="ecEmailEntry" key={email}>
          <p>{email}</p>
          <button onClick={() => {
              const editURL = `/a/course=${this.id}/student=${email}`;
              this.props.history.push(editURL)
            }}>
          Edit Report
        </button>
          <button
            onClick={e => {
              e.preventDefault();
              removeUserFromClass(email, this.id, "student")
                .then(() => {
                  const changed = this.state.studentList;
                  changed.forEach((ei, i) => {
                    if (ei === email) changed.splice(i, 1);
                  });
                  this.setState({ studentList: changed });
                })
                .catch(err => {
                  this.setState({
                    modalWindow: (
                      <StatusModal
                        title="Could Not Remove Student"
                        text={err.msg}
                        onClose={e => this.setState({ modalWindow: "" })}
                      />
                    )
                  });
                });
            }}
          >
            Remove
          </button>
        </div>
      );
    }
    return compiledList;
  }

  /*
    Same as generateStudentList(), but for teachers and also without the
    extra link,
   */
  generateTeacherList() {
    const compiledList = [];
    for (let email of this.state.teacherList) {
      compiledList.push(
        <div className="ecEmailEntry" key={email}>
          <p>{email}</p>
          <button
            onClick={e => {
              e.preventDefault();
              removeUserFromClass(email, this.id, "instructor")
                .then(() => {
                  const changed = this.state.teacherList;
                  changed.forEach((ei, i) => {
                    if (ei === email) changed.splice(i, 1);
                  });
                  this.setState({ teacherList: changed });
                })
                .catch(err => {
                  this.setState({
                    modalWindow: (
                      <StatusModal
                        title="Could Not Remove Instructor"
                        text={err.msg}
                        onClose={e => this.setState({ modalWindow: "" })}
                      />
                    )
                  });
                });
            }}
          >
            Remove
          </button>
        </div>
      );
    }
    return compiledList;
  }

  /*
    Same as generateStudentList(), but for volunteers and also without the
    extra link.

    This and generateTeacherList() used to be one function, but were split
    during development, due to initally differing implementations.
    They remain split, to allow for more direct modification.
   */
  generateVolunteerList() {
    const compiledList = [];
    for (let email of this.state.volunteerList) {
      compiledList.push(
        <div className="ecEmailEntry" key={email}>
          <p>{email}</p>
          <button
            onClick={e => {
              e.preventDefault();
              removeUserFromClass(email, this.id, "volunteer")
                .then(() => {
                  const changed = this.state.volunteerList;
                  changed.forEach((ei, i) => {
                    if (ei === email) changed.splice(i, 1);
                  });
                  this.setState({ volunteerList: changed });
                })
                .catch(err => {
                  this.setState({
                    modalWindow: (
                      <StatusModal
                        title="Could Not Remove Volunteer"
                        text={err.msg}
                        onClose={e => this.setState({ modalWindow: "" })}
                      />
                    )
                  });
                });
            }}
          >
            Remove
          </button>
        </div>
      );
    }
    return compiledList;
  }

  /**
   * HELPER METHOD
   * Generate the view for the marking criteria for this class.
   *
   * NOTE: This method is specifically different from those three above,
   * due to the differing format of the marking scheme for a class.
   * @return {[type]} [description]
   */
  generateCriteriaList() {
    const compiledList = [];
    const criteria = this.state.criteriaList;
    for (let entry of criteria) {
      compiledList.push(
        <tr key={entry.criterion}>
          <td>{entry.criterion}</td>
          <td>{entry.details.weight}</td>
          <td>{entry.details.index}</td>
          <td>
            <button
              className="ecDeleteButton"
              onClick={e => {
                removeCriterion(this.id, entry.criterion)
                  .then(s => {
                    delete this.critObj[entry.criterion];
                    const critList = [];
                    Object.keys(this.critObj).forEach(key =>
                      critList.push({
                        criterion: key,
                        details: this.critObj[key]
                      })
                    );
                    this.setState({
                      criteriaList: critList
                    });
                  })
                  .catch(err => {
                    this.setState({
                      modalWindow: (
                        <StatusModal
                          title="Could Not Remove Criterion"
                          text={err.msg}
                          onClose={e => this.setState({ modalWindow: "" })}
                        />
                      )
                    });
                  });
              }}
            >
              Remove
            </button>
          </td>
        </tr>
      );
    }
    return compiledList;
  }
}
export default EditClass;
