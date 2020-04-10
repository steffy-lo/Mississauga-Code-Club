import React from "react";
import { Link } from "react-router-dom";

import NavbarGeneric from "../Util/NavbarGeneric";
import StatusModal from "../Util/StatusModal";
import LoadingModal from "../Util/LoadingModal";

import HelpButton from "../Util/HelpButton";

import { STD_LOG, STD_STAT, STD_RELOAD } from "../Util/PrebuiltModals";

import {
  getUserTypeExplicit,
  getUserHours,
  getHoursReport
} from "../../Actions/utility.js";

import "../CSS/Util/ViewHours.css";
import "../CSS/Common.css";

/**
 * View for allowing the user to view their accumulated hours of teaching and volunteering.
 * FUNCTIONALITY: View acquired hours.
 * ALSO: FILTER HOURS by: String query (i.e. only if the reason contains "...")
 *  AND/OR ONLY entries after some date AND/OR entries before some date
 *  AND/OR Only volunteer/teaching/all entries.
 *  ALSO: Request and download an auto-generated confirmation PDF of the hours acquired,
 *  based on the filter used (excluding the string filter).
 *  ALSO, display the total number of hours.
 *
 * CONTEXT: Not accessible to Students.
 * NOTE: This is the dashboard for Volunteers.
 * @extends React
 */
class ViewHours extends React.Component {
  constructor(props) {
    super(props);
    this.uTE = getUserTypeExplicit();
    this.state = {
      modalWindow: "",
      fullList: [],
      deployedList: "",
      fromDate: "",
      toDate: "",
      purposeQuery: "",
      isPaid: this.uTE === "volunteer" ? false : null,
      filterBoxState: "none",
      totalHours: 0
    };
  }

  componentDidMount() {
    //this.setState({deployedList: this.generateHoursRows(this.state.fullList)})
    this.getOwnHours();
  }

  getOwnHours() {
    this.setState({
      modalWindow: <LoadingModal text="Getting Hours ..." />
    });
    getUserHours()
      .then(hours => {
        const deployment = this.generateHoursRows(hours);
        this.setState({
          fullList: hours,
          deployedList: deployment
        });
        this.setState({ modalWindow: "" });
      })
      .catch(err => {
        this.setState({ modalWindow: "" });
        if (err.stat === 403) {
          STD_LOG(this);
        } else {
          STD_RELOAD(err.msg, this, () => this.props.history.push("/"));
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric
          crumbs={[{ tag: "Dashboard", link: "/" }, { tag: "View Your Hours" }]}
        help={
            <HelpButton
              text={
                <div>
		  This page allows you to see the hours logged associated with yourself.
                  <br />
		  If paid is True, then the work was done for money. If it is False, then it was volunteer work. This does not indicate if you have actually been paid.
		  <br />
		  You may filter for various criteria by clicking Filtering Options and entering the appropriate information.
		  <br />
		  After filtering, you may click Get Report to get a formal PDF indicating the hours selected, such as between two dates.
		  <br />
		  Please contact an administrator if there is an error with your hours.

		  <br />
		  Admins can also edit hours from this page by pressing the Edit Hours button.

                </div>
              }
              parentForClose={this}
            />
          }

	/>
        <div className="flexContentContainerGeneric">
          <div className="flex horizontalCentre">
            <div id="mainVHoursWindow">
              <div id="mVHWindowHeader">
                <div>Hours Worked</div>
                {this.uTE !== "administrator" ? (
                  ""
                ) : (
                  <Link className={`${this.uTE}VH`} to="/a/hours/@">
                    Edit Hours
                  </Link>
                )}
              </div>
              {this.state.deployedList === "" ? (
                <h2 id="noHoursLogged">You have not logged any hours.</h2>
              ) : (
                <div id="scrollableHoursPane">
                  <table id="VHviewTable">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Reason</th>
                        <th>Hours</th>
                        <th>Paid</th>
                      </tr>
                    </thead>
                    <tbody>{this.state.deployedList}</tbody>
                  </table>
                  <div id="VHhoursCount">
                    <span>
                      Total in selection:{" "}
                      <span className={`${this.uTE}Text`}>
                        {this.state.totalHours}
                      </span>{" "}
                      <b>hour(s)</b>
                    </span>
                  </div>
                </div>
              )}

              {/* Collapsible filter options box. */}
              <form>
                <div id="vhSettingsWrapper">
                  <div
                    className={`${this.uTE}VH`}
                    id="vhsettingsExpand"
                    onClick={e => {
                      const newStatus =
                        this.state.filterBoxState === "none" ? "flex" : "none";
                      this.setState({ filterBoxState: newStatus });
                    }}
                  >
                    <span>Filtering Options</span>
                    <span>+</span>
                  </div>
                  <div
                    style={{ display: this.state.filterBoxState }}
                    id="vhSettingsExpanded"
                  >
                    <div id="dateFieldSet">
                      <p>Date:</p>
                      <label>From: </label>
                      <input
                        type="date"
                        value={this.state.fromDate}
                        onChange={e => {
                          this.setState({ fromDate: e.target.value });
                        }}
                      />
                      <br />
                      <label>To: </label>
                      <input
                        type="date"
                        value={this.state.toDate}
                        onChange={e => {
                          this.setState({ toDate: e.target.value });
                        }}
                      ></input>
                    </div>
                    <div>
                      <p>Event: </p>
                      <input
                        type="search"
                        placeholder="event name"
                        value={this.state.purposeQuery}
                        onChange={e => {
                          this.setState({ purposeQuery: e.target.value });
                        }}
                      ></input>
                      <br />
                      <button
                        className={`${this.uTE}VH`}
                        id="vhVerboseClear"
                        onClick={e => {
                          e.preventDefault();
                          this.setState({ purposeQuery: "" });
                        }}
                      >
                        Clear Query
                      </button>
                    </div>
                    <div>
                      <p>Type: </p>
                      <input
                        type="radio"
                        value={-1}
                        disabled={/*this.uTE === 'volunteer'*/ false}
                        checked={this.state.isPaid === null}
                        onChange={_ => this.setState({ isPaid: null })}
                      />
                      <label htmlFor={null}>All</label>
                      <br />
                      <input
                        type="radio"
                        value={1}
                        disabled={/*this.uTE === 'volunteer'*/ false}
                        checked={this.state.isPaid === true}
                        onChange={_ => this.setState({ isPaid: true })}
                      />
                      <label htmlFor={1}>Only Teaching</label>
                      <br />
                      <input
                        type="radio"
                        value={0}
                        checked={this.state.isPaid === false}
                        onChange={_ => this.setState({ isPaid: false })}
                      />
                      <label htmlFor={0}>Only Volunteering</label>
                      <br />
                    </div>
                  </div>
                </div>
                <div id="vhFuncButtonsWrapper">
                  <button
                    className={`${this.uTE}VH`}
                    disabled={this.state.deployedList === ""}
                    onClick={e => {
                      e.preventDefault();
                      this.setState({
                        modalWindow: <LoadingModal text="Getting Report ..." />
                      });
                      getHoursReport(
                        this.state.fromDate,
                        this.state.toDate,
                        this.state.isPaid
                      )
                        .then(url => {
                          this.setState({ modalWindow: "" });
                          let a = document.createElement("a");
                          a.href = url;
                          a.download = "report.pdf";
                          a.click();
                        })
                        .catch(err => {
                          STD_STAT("Could Not Get Report", err.msg, this);
                        });
                    }}
                  >
                    Get Report
                  </button>
                  <input
                    className={`${this.uTE}VH`}
                    type="submit"
                    value="Apply Filter"
                    disabled={this.state.fullList.length === 0}
                    onClick={e => {
                      e.preventDefault();
                      this.repopulateDeployedList();
                    }}
                  />
                  <input
                    className={`${this.uTE}VH`}
                    type="reset"
                    value="Clear Filters"
                    disabled={this.state.fullList.length === 0}
                    onClick={e => {
                      e.preventDefault();
                      this.setState({
                        fromDate: "",
                        toDate: "",
                        purposeQuery: "",
                        isPaid: this.uTE === "volunteer" ? false : null,
                        deployedList: this.generateHoursRows(
                          this.state.fullList
                        )
                      });
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  /*
        Complex filter function constructor.
        The constructed function is used as a filter by generateHoursRows().
        Called everytime "Apply Filter" is clicked.
       */
  constructFilterFunction() {
    const payCheck =
      this.state.isPaid === null
        ? _ => true
        : paid => paid === this.state.isPaid;
    const queryCheck = evnt => evnt.includes(this.state.purposeQuery);
    const fromCheck =
      this.state.fromDate === ""
        ? _ => true
        : date => new Date(date) >= new Date(this.state.fromDate + " 0:00:00");
    const toCheck =
      this.state.toDate === ""
        ? _ => true
        : date => new Date(date) <= new Date(this.state.toDate + " 23:59:59");
    const compiledFunc = hours_record => {
      return (
        hours_record &&
        payCheck(hours_record.paid) &&
        queryCheck(hours_record.purpose) &&
        fromCheck(hours_record.dateTime) &&
        toCheck(hours_record.dateTime)
      );
    };
    return compiledFunc;
  }

  /*
          Used to rerender the list of valid hours.
          Valid hours change based on the filter applied.
          Called on application of a new filter.
         */
  repopulateDeployedList() {
    const toDeploy = this.generateHoursRows(
      this.state.fullList,
      this.constructFilterFunction()
    );
    this.setState({ deployedList: toDeploy });
  }

  /*
          Populates the view table for hours, using the given list and filter function.
          If no filter is given, the default includes everything.
         */
  generateHoursRows(inputList, filter = _ => true) {
    let hoursSum = 0;
    const compiledList = [];
    for (let record of inputList) {
      if (filter(record)) {
        compiledList.push(
          <HoursRow
            key={record._id}
            date={new Date(record.dateTime).toLocaleString()}
            event={record.purpose}
            hours={record.hours}
            paid={record.paid}
          />
        );
        hoursSum += parseFloat(record.hours);
      }
    }
    this.setState({ totalHours: hoursSum });
    return compiledList;
  }
}

/* A table row containing the information for a single hours entry */
class HoursRow extends React.Component {
  constructor(props) {
    super(props);
    this.paid =
      props.paid === undefined || props.paid === null ? 0 : props.paid;
    this.date = props.date;
    this.hours = props.hours;
    this.event = props.event;
  }

  render() {
    return (
      <tr className="VHviewRow">
        <td>{this.date}</td>
        <td>{this.event}</td>
        <td>{this.hours}</td>
        {this.paid ? (
          <td className="paid">&#10003;</td>
        ) : (
          <td className="unPaid">&times;</td>
        )}
      </tr>
    );
  }
}

export default ViewHours;
