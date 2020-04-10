import React from "react";

import NavbarGeneric from "../Util/NavbarGeneric";
import LoadingModal from "../Util/LoadingModal";
import StatusModal from "../Util/StatusModal";
import { STD_LOG, STD_STAT, STD_RELOAD } from "../Util/PrebuiltModals";

import {
  getClassMarkingScheme,
  getClassReportByEmail,
  submitFeedback
} from "../../Actions/teacher";
import { getUserTypeExplicit } from "../../Actions/utility";

import "../CSS/Teacher/FeedbackForm.css";
import "../CSS/Common.css";

class FeedbackForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalWindow: "",
      scheme: {},
      courseName: "",
      marks: {},
      recommended: "",
      feedback: ""
    };
    this.studentEmail = props.match.params.sid;
    this.courseID = props.match.params.cid;

    this.uType = getUserTypeExplicit()[0];
  }

  componentDidMount() {
    this.populateForm();
  }

  populateForm() {
    this.setState({
      modalWindow: <LoadingModal text="Getting Report Info ..." />
    });
    const schemePromise = getClassMarkingScheme(this.courseID);
    const reportPromise = getClassReportByEmail(
      this.courseID,
      this.studentEmail
    );
    Promise.all([schemePromise, reportPromise])
      .then(values => {
        console.log(values);
        const validMarks = {};
        for (let section in values[0].markingSections) {
          validMarks[section] = !values[1].marks[section]
            ? 0
            : values[1].marks[section];
        }
        this.setState({
          scheme: values[0].markingSections,
          courseName: values[0].courseTitle,
          marks: validMarks,
          recommended: values[1].nextCourse,
          feedback: values[1].comments,
          modalWindow: ""
        });
      })
      .catch(err => {
        this.setState({ modalWindow: "" });
        if (err.stat === 403) STD_LOG(this);
        else STD_RELOAD(err.msg, this, () => this.props.history.goBack());
      });
  }

  generateGradingSection() {
    const gradingList = [];
    let ticker = 0;
    for (let section in this.state.scheme) {
      gradingList.push(
        <span className="FBgradSection" key={ticker++}>
          {section}:&nbsp;
          <input
            type="number"
            length="4"
            max={this.state.scheme[section].weight}
            min="0"
            value={this.state.marks[section]}
            onChange={e => {
              const exMarks = this.state.marks;
              exMarks[section] = e.target.value === "" ? 0 : e.target.value;
              this.setState({ marks: exMarks });
            }}
          />
          &nbsp;/&nbsp;<b>{this.state.scheme[section].weight}</b>
        </span>
      );
    }
    return gradingList;
  }

  submitForm() {
    this.setState({
      modalWindow: <LoadingModal text="Submitting Feedback ..." />
    });
    submitFeedback(this.studentEmail, this.courseID, this.state)
      .then(() => {
        this.setState({
          modalWindow: (
            <StatusModal
              title="Feedback Submission Successful"
              text={`Feedback successfully submitted for ${this.studentEmail}`}
              onClose={() => this.setState({ modalWindow: "" })}
            />
          )
        });
      })
      .catch(err => {
        this.setState({modalWindow: ""});
        if (err.stat === 403) STD_LOG(this);
        else STD_STAT("Could Not Submit Feedback", err.msg, this);
      });
  }

  render() {
    const navList = [{ tag: "Dashboard", link: "/" }];
    if (this.uType === "a")
      navList.push({ tag: "Course List", link: "/a/courses" });
    navList.push({
      tag: `Report for ${this.studentEmail} in class #${this.courseID}`
    });
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric crumbs={navList} />
        <div className="flexContentContainerGeneric">
          <div id="FBmainWrap" className="flex verticalCentre defaultShadow">
            <h2 id="FBCourseTitle">{this.state.courseName}</h2>
            <h3 id="FBReportTag">Report for {this.studentEmail}:</h3>
            {/* Grades*/}
            <div id="FBCriteriaContainer">{this.generateGradingSection()}</div>
            {/* Course Recommendation*/}
            <div id="FBRecommended">
              <span>Recommended Course:&nbsp;</span>
              <input
                type="text"
                value={this.state.recommended}
                onChange={e => this.setState({ recommended: e.target.value })}
              />
            </div>

            {/* Written Feedback*/}
            <div id="FBFeedback">
              <h5>Feedback:</h5>
              <textarea
                rows="10"
                value={this.state.feedback}
                onChange={e => this.setState({ feedback: e.target.value })}
              />
            </div>

            <div id="FBSubmit">
              <button id="FBSubmit" onClick={() => this.submitForm()}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FeedbackForm;
