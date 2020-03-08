import React from 'react';
import { Link } from 'react-router-dom';
import { uid } from 'react-uid';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { getUserTypeExplicit } from '../../Actions/utility.js';

import "../CSS/Admin/EditClass.css";
import "../CSS/Common.css";

class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.class_id = props.match.params.class_id;
    this.state = {
      modalWindow: "",

      //Teachers
      teacherList: [],
      //Students
      studentList: [],
      //Criteria
      criteriaList: {},
      courseTitle: "",
      activeCourse: 1
    };
    this.resetChanges = () => null;
  }

  componentDidMount() {
    this.setState({
      criteriaList: {
        "For-loops": 4,
        "Quantum Magic": 18
      },
      teacherList: [
        "bebil@pebil.com",
        "debil@gebil.com"
      ],
      studentList: [
        "abla@asdasd.com",
        "kadabla@asdasdasd.com"
      ]
    });
  }

  render() {
    return(
      <React.Fragment>
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
                          value={this.class_id}
                          />
                        </span>
                        <span className="flex verticalCentre">
                          <span>
                            <input type="radio"
                            checked={this.state.activeCourse === 1}
                            value={1}
                            onChange={e => this.setState({activeCourse: 1})} />
                            &nbsp;Active
                          </span>
                          <span>
                            <input type="radio"
                            checked={this.state.activeCourse === 0}
                            value={0}
                            onChange={e => this.setState({activeCourse: 0})} />
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
                    <button>
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
                            <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.generateCriteriaList()}
                        </tbody>
                        </table>
                      </div>

                      <form className="ecBarAdd">
                        <input type="text"
                        placeholder="criterion title"
                        />
                        <input type="number"
                        placeholder="marks"
                        />
                        <input type="submit"
                        value="Add Criterion"
                        onClick={e => {
                          e.preventDefault();
                        }}
                        />
                      </form>
                    </div>
                  </div>

                  <div id="editClassMainC">
                    <h2>
                      Teachers:
                    </h2>
                    <div id="tchLstW" className="flexCol">
                      <div id="tchLst" className="vScrollable fill">
                        {this.generateEmailList("teacherList")}
                      </div>
                    </div>
                    <form className="ecBarAdd">
                      <input type="email"
                      placeholder="teacher Email"
                      />
                      <input type="submit"
                      value="Add Teacher"
                      onClick={e => {
                        e.preventDefault();
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
                        {this.generateEmailList("studentList")}
                      </div>
                    </div>
                    <form className="ecBarAdd">
                      <input type="email"
                      placeholder="student email"
                      />
                      <input type="submit"
                      value="Add Student"
                      onClick={e => {
                        e.preventDefault();
                      }}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </React.Fragment>
    );
  }

  generateEmailList(selector) {
    const compiledList = [];
    for(let email of this.state[selector]) {
      compiledList.push(
        <div className="ecEmailEntry" key={email}>
          <p>{email}</p>
          <button
          onClick={e => {
            const changed = this.state[selector];
            changed.forEach((ei, i) => {
              if (ei === email) changed.splice(i, 1);
            });
            if (selector==="teacherList") this.setState({teacherList: changed});
            else this.setState({studentList: changed});
          }}>
            Delete
          </button>
        </div>
      );
    }
    return compiledList;
  }

  generateCriteriaList() {
    const compiledList = [];
    const criteria = this.state.criteriaList
    for(let entry in criteria) {
      compiledList.push(
        <tr key={entry}>
          <td>{entry}</td>
          <td>{criteria[entry]}</td>
          <td>
            <button className="ecDeleteButton"
            onClick={e => {
              const changed = this.state.criteriaList;
              delete changed[entry];
              this.setState({
                criteriaList: changed
              });
            }}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    }
    return compiledList;
  }


}
export default EditClass;
