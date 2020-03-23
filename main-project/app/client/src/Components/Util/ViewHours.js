import React from 'react';
import { Link } from 'react-router-dom';
import { uid } from 'react-uid';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { getUserTypeExplicit, getCurrentUserHours } from '../../Actions/utility.js';

import "../CSS/Util/ViewHours.css";
import "../CSS/Common.css";

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
      filterBoxState: 'hidden',
      totalHours: 0
    };
    this.idTicker = 0;
  }

  componentDidMount() {
    //this.setState({deployedList: this.generateHoursRows(this.state.fullList)})
    this.getOwnHours();
  }

  getOwnHours() {
    getCurrentUserHours()
    .then(hours => {
      const deployment = this.generateHoursRows(hours)
      this.setState({
        fullList: hours,
        deployedList: deployment
      })
      this.setState({modalWindow: ""});
    })
    .catch(err => {
        const clFunc = () => this.setState({modalWindow: ""});
        if (err.stat === 403) {
          this.setState({modalWindow: ""});
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
          this.setState({modalWindow: ""});
          this.setState({
            modalWindow:
              <LoadingModal
                text={err.msg}
              />
          })
          setTimeout(() => this.props.history.push("/"), 1000);
        }
    })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric />
        <div className="absolute fillContainer flex verticalCentre">
          <div className="flex horizontalCentre">
            <div id="mainVHoursWindow">
              <div id="mVHWindowHeader">
                <div>
                  Hours Worked
                </div>
                {(this.uTE !== "administrator") ? "" :
                  (
                    <Link
                      className={`${this.uTE}VH`}
                      to="/" >
                      Edit Hours
                    </Link>
                  )
                }
              </div>
              {/*<table id="VHviewTableHeader">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Purpose</th>
                    <th>Hours</th>
                    <th>Paid</th>
                  </tr>
                </thead>
              </table>*/}
              {this.state.deployedList === "" ?
                (
                  <h2 id="noHoursLogged">
                    You have not logged any hours.
                  </h2>
                )
                :
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
                    <tbody>
                      {this.state.deployedList}
                    </tbody>
                  </table>
                  <div id="VHhoursCount">
                    <span>
                      Total in selection: <span className={`${this.uTE}Text`}>
                        {this.state.totalHours}
                        </span> <b>hour(s)</b>
                    </span>
                  </div>
                </div>
              }

              <form>
                <div id="vhSettingsWrapper">
                  <div
                    className={`${this.uTE}VH`}
                    id="vhsettingsExpand"
                    onClick={e => {
                      const newStatus = this.state.filterBoxState === 'hidden' ?
                      'visible' : 'hidden';
                      this.setState({filterBoxState: newStatus});
                    }}>
                    <span>
                      Filtering Options
                    </span>
                    <span>+</span>
                  </div>
                  <div
                    className={this.state.filterBoxState}
                    id="vhSettingsExpanded">
                    <div id="dateFieldSet">
                      <p>Date:</p>
                      <label>From: </label>
                      <input
                        type="date"
                        onChange={e => {
                          this.setState({fromDate: e.target.value})
                        }}/>
                      <br/>
                      <label>To: </label>
                      <input
                        type="date"
                        onChange={e => {
                          this.setState({toDate: e.target.value})
                        }}>
                      </input>
                    </div>
                    <div>
                      <p>Event: </p>
                      <input
                        type="search"
                        placeholder="event name"
                        value={this.state.purposeQuery}
                        onChange={e =>
                          {this.setState({purposeQuery: e.target.value})}
                        }>
                      </input>
                      <br/>
                      <button
                        className={`${this.uTE}VH`}
                        id="vhVerboseClear"
                        onClick={e => {
                          e.preventDefault();
                          this.setState({purposeQuery: ""});
                        }}>
                        Clear Query
                      </button>
                    </div>
                    <div>
                      <p>Type: </p>
                      <input
                        type="radio"
                        value={-1}
                        disabled={this.uTE === 'volunteer'}
                        checked={this.state.isPaid === null}
                        onChange={_ => this.setState({isPaid: null})} />
                      <label htmlFor={null}>All</label>
                      <br />
                      <input
                        type="radio"
                        value={1}
                        disabled={this.uTE === 'volunteer'}
                        checked={this.state.isPaid === true}
                        onChange={_ => this.setState({isPaid: true})} />
                      <label htmlFor={1}>
                        Only Teaching
                      </label>purposeQuery
                      <br />
                      <input
                        type="radio"
                        value={0}
                        checked={this.state.isPaid === false}
                        onChange={_ => this.setState({isPaid: false})} />
                      <label htmlFor={0}>
                        Only Volunteering
                      </label>
                      <br />
                    </div>
                  </div>
                </div>
                <div id="vhFuncButtonsWrapper">

                  <button
                    className={`${this.uTE}VH`}
                    disabled={this.state.deployedList === ""}
                    onClick={e => {
                      //requestReport(this.state.fromDate, this.state.toDate,
                      //    this.state.isPaid)
                    }}>
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
                    }}/>
                    <input
                      className={`${this.uTE}VH`}
                      type="reset"
                      value="Clear Filters"
                      disabled={this.state.fullList.length === 0}
                      onClick={e => {
                        e.preventDefault();

                      }}/>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      }

      constructFilterFunction() {
        const payCheck = this.state.isPaid === null ? (_) => true :
        (paid) => paid === this.state.isPaid;
        const queryCheck = (evnt) => evnt.includes(this.state.purposeQuery);
        const fromCheck = this.state.fromDate === "" ? (_) => true :
        (date) => new Date(date) >= new Date(this.state.fromDate + ' 0:00:00');
        const toCheck = this.state.toDate === "" ? (_) => true :
        (date) => new Date(date) <= new Date(this.state.toDate + ' 23:59:59');
        const compiledFunc = (hours_record) => {
          return (hours_record &&
            payCheck(hours_record.paid) &&
            queryCheck(hours_record.purpose) &&
            fromCheck(hours_record.dateTime) &&
            toCheck(hours_record.date));
          };
        return compiledFunc;
        }

        repopulateDeployedList() {
          const toDeploy =
          this.generateHoursRows(this.state.fullList, this.constructFilterFunction());
          this.setState({deployedList: toDeploy});
        }

        generateHoursRows(inputList, filter=(_) => true) {
          console.log(inputList)
          let hoursSum = 0
          const compiledList = [];
          for (let record of inputList) {
            if (filter(record)) {
              compiledList.push(
                <HoursRow
                  key={uid(this.idTicker++)}
                  date={new Date(record.dateTime).toLocaleString()}
                  event={record.purpose}
                  hours={record.hours}
                  paid={record.paid} />
              )
              hoursSum += record.hours
            }
          }
          this.setState({totalHours: hoursSum})
          return compiledList;
        }

      }

      class HoursRow extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            isVisible: "shown"
          }
          this.paid = props.paid === undefined || props.paid === null ? 0 : props.paid;
          this.date = props.date;
          this.hours = props.hours;
          this.event = props.event;
        }

        render() {
          return(
            <tr className="VHviewRow">
              <td>
                {this.date}
              </td>
              <td>
                {this.event}
              </td>
              <td>
                {this.hours}
              </td>
              {this.paid ?
                <td className="paid">&#10003;</td>
                :
                <td className="unPaid">&times;</td>
              }
            </tr>
          )
        }
      }

      export default ViewHours;
