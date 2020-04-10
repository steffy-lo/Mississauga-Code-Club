import React from "react";

import NavbarGeneric from "../Util/NavbarGeneric";
import LoadingModal from "../Util/LoadingModal";
import StatusModal from "../Util/StatusModal";

import {
  getClassMarkingScheme,
  setCriterion,
  removeCriterion
} from "../../Actions/teacher";
import { getUserTypeExplicit } from "../../Actions/utility";

import "../CSS/Teacher/EditClassReport.css";
import "../CSS/Common.css";

class EditClassReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalWindow: "",
      criteria: {},
      criteriaDisplayed: "",
      courseName: "",

      settingCriterion: "",
      settingWeight: "",
      settingIndex: ""
    };
    this.classID = props.match.params.course_id;
    this.uType = getUserTypeExplicit()[0];
  }

  componentDidMount() {
    this.getCriteria();
  }

  getCriteria() {
    this.setState({
      modalWindow: <LoadingModal text="Getting Class Marking Schema ..." />
    });
    getClassMarkingScheme(this.classID)
      .then(criteria => {
        this.setState({
          modalWindow: "",
          criteria: criteria.markingSections,
          courseName: criteria.courseTitle
        });
      })
      .catch(err => {
        this.setState({ modalWindow: "" });
        console.log(err);
      });
  }

  setBottomCriteria(criterion) {
    const { weight, index } = this.state.criteria[criterion];
    this.setState({
      settingCriterion: criterion,
      settingWeight: weight,
      settingIndex: index
    });
  }

  generateCriteriaList() {
    const critList = [];
    //For assigning react keys.
    let ticker = 0;
    for (let criterion in this.state.criteria) {
      critList.push(
        <tr onClick={e => this.setBottomCriteria(criterion)} key={ticker++}>
          <th className="leftAText">{criterion}</th>
          <td>{this.state.criteria[criterion].weight}</td>
          <td>{this.state.criteria[criterion].index}</td>
          <td className="tCritDelButtons">
            <button
              onClick={e => {
                this.deleteCriteria(criterion);
              }}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    }
    return critList;
  }

  deleteCriteria(criterion) {
    this.setState({
      modalWindow: <LoadingModal text="Deleting Criterion ..." />
    });
    removeCriterion(this.classID, criterion)
      .then(res => {
        const newCriteria = this.state.criteria;
        delete newCriteria[criterion];
        this.setState({
          criteria: newCriteria,
          settingCriterion: "",
          settingWeight: "",
          settingIndex: "",
          modalWindow: ""
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ modalWindow: "" });
      });
  }

  updateCriteria() {
    const { settingCriterion, settingWeight, settingIndex } = this.state;
    setCriterion(this.classID, settingCriterion, settingWeight, settingIndex)
      .then(res => {
        const newCriteria = this.state.criteria;
        newCriteria[this.state.settingCriterion] = {
          weight: this.state.settingWeight,
          index: this.state.settingIndex
        };
        this.setState({
          criteria: newCriteria,
          settingCriterion: "",
          settingWeight: "",
          settingIndex: ""
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const navList = [{ tag: "Dashboard", link: "/" }];
    if (this.uType === "a")
      navList.push({ tag: "Course List", link: "/a/courses" });
    navList.push({ tag: `Edit criteria for class #${this.classID}` });

    const criteriaList = this.generateCriteriaList();
    console.log(criteriaList);
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric crumbs={navList} />
        <div className="flexContentContainerGeneric">
          <div id="tCriteriaListMain">
            <h1>{this.state.courseName}</h1>
            {criteriaList.length === 0 ? (
              <div className="centreText">
                This class currently has no marking scheme
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th className="leftAText">Criterion</th>
                    <th>Weight</th>
                    <th>Index</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>{criteriaList}</tbody>
              </table>
            )}
            <div>
              <input
                type="text"
                value={this.state.settingCriterion}
                placeholder="Criterion Name"
                onChange={e =>
                  this.setState({ settingCriterion: e.target.value })
                }
              />
              <input
                type="number"
                value={this.state.settingWeight}
                placeholder="Criterion Weight"
                onChange={e => this.setState({ settingWeight: e.target.value })}
              />
              <input
                type="number"
                value={this.state.settingIndex}
                placeholder="Criterion Index"
                onChange={e => this.setState({ settingIndex: e.target.value })}
              />
            </div>
            <div id="tCriteriaButtonDiv">
              <button onClick={e => this.updateCriteria()}>
                Set Criterion
              </button>
              <button
                onClick={e => {
                  this.setState({
                    settingCriterion: "",
                    settingWeight: "",
                    settingIndex: ""
                  });
                }}
              >
                Clear Inputs
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditClassReport;
