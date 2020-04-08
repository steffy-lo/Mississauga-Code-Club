import React from 'react';
import { Link } from 'react-router-dom';

import NavbarGeneric from '../Util/NavbarGeneric';
import LoadingModal from "../Util/LoadingModal";
import StatusModal from "../Util/StatusModal";

import { getClassMarkingScheme, setCriterion, removeCriterion } from "../../Actions/teacher";
import { getUserTypeExplicit } from "../../Actions/utility";

import "./TeacherDash.css";
import "../CSS/Common.css"

class EditClassReport extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
       modalWindow: "",
       criteria: {},
       courseTitle: "",
       criteriaDisplayed: "",
       courseName: "",

       settingCriterion: "",
       settingWeight: "",
       settingIndex: ""
   }
   this.classID = props.match.params.course_id;
   this.uType = getUserTypeExplicit()[0];
  }


  componentDidMount(){
      this.getCriteria();
  }

  getCriteria() {
    getClassMarkingScheme(this.classID)
    .then(criteria => {
      this.setState({
        criteria: criteria.markingSections,
        courseName: criteria.courseTitle
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  setBottomCriteria(criterion) {
    const { weight, index } = this.state.criteria[criterion];
    this.setState({
      settingCriterion: criterion,
      settingWeight: weight,
      settingIndex: index
    })
  }

  generateCriteriaList() {
    const critList = [];
    //For assigning react keys.
    let ticker = 0;
    for(let criterion in this.state.criteria) {
      critList.push(
        <tr
          onClick={e => this.setBottomCriteria(criterion)}
          key={ticker++}
          >
          <th>{criterion}</th>
          <td>{this.state.criteria[criterion].weight}</td>
          <td>{this.state.criteria[criterion].index}</td>
          <td>
            <button onClick={e => {this.deleteCriteria(criterion)}}>
              Delete
            </button>
          </td>
        </tr>
      )
    }
    return critList;
  }

  deleteCriteria(criterion) {
    removeCriterion(this.classID, criterion)
    .then(res => {
      const newCriteria = this.state.criteria;
      delete newCriteria[criterion];
      this.setState({ criteria: newCriteria })
    })
    .catch(err => {
      console.log(err)
    })
  }

  updateCriteria() {
    const { settingCriterion, settingWeight, settingIndex } = this.state;
    setCriterion(this.classID, settingCriterion, settingWeight, settingIndex)
    .then(res => {
      const newCriteria = this.state.criteria
      newCriteria[this.state.settingCriterion] = {
        weight: this.state.settingWeight,
        index: this.state.settingIndex
      };
      this.setState({
        criteria: newCriteria,
        settingCriterion: "",
        settingWeight: "",
        settingIndex: ""
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    const navList = [{tag: "Dashboard", link: "/"}]
    if (this.uType === 'a') navList.push({tag: "Course List", link: "/a/courses"});
    navList.push({tag: `Edit criteria for class ${this.classID}`});
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric crumbs={navList}/>
        <div className="flexContentContainerGeneric">
          <div id="tCriteriaListMain">
            <h1>
              {this.state.courseName}
            </h1>
            <table>
              <thead>
                <tr>
                  <th>Criterion</th>
                  <th>Weight</th>
                  <th>Index</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {this.generateCriteriaList()}
              </tbody>
            </table>
            <div>
              <input
                type="text"
                value={this.state.settingCriterion}
                placeholder="Criterion Name"
                onChange={e => this.setState({settingCriterion: e.target.value})}
                />
              <input
                type="number"
                value={this.state.settingWeight}
                placeholder="Criterion Weight"
                onChange={e => this.setState({settingWeight: e.target.value})}
                />
              <input
                type="number"
                value={this.state.settingIndex}
                placeholder="Criterion Index"
                onChange={e => this.setState({settingIndex: e.target.value})}
                />
            </div>
            <div>
              <button onClick={e => this.updateCriteria()}>
                Set Criterion
              </button>
              <button onClick={e => {
                  this.setState({
                    settingCriterion: "",
                    settingWeight: "",
                    settingIndex: ""
                  })}}>
                  Clear Inputs
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }

export default EditClassReport;
