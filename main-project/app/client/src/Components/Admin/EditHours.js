import React from 'react';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';
import EditHourEntry from './EditHourEntry'
import NewHoursEntry from './NewHoursEntry'

import HelpButton from "../Util/HelpButton";

import { getUserTypeExplicit, getUserHours, getHoursReport } from '../../Actions/utility.js';

import "../CSS/Util/ViewHours.css";
import "../CSS/Common.css";

/**
 * View for editing the hours log for a given user.
 * FUNCTIONALITY: Special version of ViewHours, but also with editable hours
 * (by clicking on an entry, it can be edited) & a button for creating new entries.
 * For more information, see Util:ViewHours.js
 *
 * EXPECTS URL PROP: <email:String>: Email of the user, whose hours log is to be modified.
 * @extends React
 */
class EditHours extends React.Component {

  constructor(props) {
    super(props);
    console.log(props)
    this.email = props.match.params.email === undefined ||
      props.match.params.email === "@" ?
      null : props.match.params.email;
    this.uTE = getUserTypeExplicit();
    this.state = {
      modalWindow: "",
      fullList: [],
      deployedList: "",
      fromDate: "",
      toDate: "",
      purposeQuery: "",
      isPaid: this.uTE === "volunteer" ? false : null,
      filterBoxState: 'none',
      totalHours: 0
    };
  }

  componentDidMount() {
    this.getHours();
  }

  getHours(loadingText="Getting hours records ...") {
    this.setState({
      modalWindow:
        <LoadingModal
          text={loadingText}
        />
    })
    getUserHours(this.email)
    .then(hours => {
      const deployment = this.generateHoursRows(hours)
      this.setState({
        fullList: hours,
        deployedList: deployment
      })
      this.setState({modalWindow: ""});
    })
    .catch(err => {
        //const clFunc = () => this.setState({modalWindow: ""});
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
    const navList = [{tag: "Dashboard", link: "/a/"}];
    navList.push(this.email === null ?
      {tag: "Edit Your Hours"} : {tag: `Edit Hours for ${this.email}`});
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric crumbs={navList}

	help={
                <HelpButton
                text={
                        <div>
			This page allows you to edit the hours records associated with yourself or other users.
			<br />


		        </div>
			}


                      parentForClose = {this}
                    />
		}/>
        <div className="flexContentContainerGeneric">
          <div className="flex horizontalCentre">
            <div id="mainVHoursWindow">
              <div id="mVHWindowHeader">
                <div>
                    Editing Hours for:&nbsp;
                    <br />
                    <i>{this.email === null ? "Yourself" : this.email}</i>
                </div>
              </div>
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
                      const newStatus = this.state.filterBoxState === 'none' ?
                      'flex' : 'none';
                      this.setState({filterBoxState: newStatus});
                    }}>
                    <span>
                      Filtering Options
                    </span>
                    <span>+</span>
                  </div>
                  <div
                    style={{display: this.state.filterBoxState}}
                    id="vhSettingsExpanded">
                    <div id="dateFieldSet">
                      <p>Date:</p>
                      <label>From: </label>
                      <input
                        type="date"
                        value={this.state.fromDate}
                        onChange={e => {
                          this.setState({fromDate: e.target.value})
                        }}/>
                      <br/>
                      <label>To: </label>
                      <input
                        type="date"
                        value={this.state.toDate}
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
                        checked={this.state.isPaid === null}
                        onChange={_ => this.setState({isPaid: null})} />
                      <label htmlFor={null}>All</label>
                      <br />
                      <input
                        type="radio"
                        value={1}
                        checked={this.state.isPaid === true}
                        onChange={_ => this.setState({isPaid: true})} />
                      <label htmlFor={1}>
                        Only Teaching
                      </label>
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
                    e.preventDefault();
                    this.setState({
                      modalWindow: <LoadingModal text="Getting Report ..."/>
                    })
                    getHoursReport(
                      this.state.fromDate,
                      this.state.toDate,
                      this.state.isPaid,
                      this.email
                    )
                      .then(url => {
                        this.setState({modalWindow: ""});
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = 'report.pdf';
                        a.click();
                      })
                      .catch(err => {
                        this.setState({
                          modalWindow:
                            <StatusModal title="Could Not Get Report"
                              text={err.msg}
                              onClose={e => this.setState({modalWindow: ""})}
                              />
                        })
                      })
                  }}>
                  Get Report
                </button>

                  <button
                    className={`${this.uTE}VH`}
                    onClick={e => {
                      e.preventDefault();
                      this.setState({
                        modalWindow: <NewHoursEntry
                          email={this.email}
                          modalInteract={(modal) => this.setState({modalWindow: modal})}
                          reload={() => {
                            this.setState({deployedList: ""})
                            this.getHours("Refreshing hours record ...")
                          }}
                          />
                      })
                    }}>
                    New Entry
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
                        this.setState({
                          fromDate: "",
                          toDate: "",
                          purposeQuery: "",
                          isPaid: this.uTE === "volunteer" ? false : null,
                          deployedList: this.generateHoursRows(this.state.fullList)
                        })
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
            toCheck(hours_record.dateTime));
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
                  key={record._id}
                  id={record._id}
                  date={new Date(record.dateTime)}
                  event={record.purpose}
                  hours={record.hours}
                  paid={record.paid}
                  modalInteract={modal => {this.setState({
                    modalWindow: modal
                  })}}
                  reload={() => {
                    this.setState({deployedList: ""})
                    this.getHours("Refreshing hours record ...")
                  }}
                />
              )
              hoursSum += parseFloat(record.hours)
            }
          }
          this.setState({totalHours: hoursSum})
          return compiledList;
        }

      }

      class HoursRow extends React.Component {
        constructor(props) {
          super(props);
          this._id = props.id;
          this.reload = props.reload;
          this.state = {
            paid: props.paid === undefined || props.paid === null ? false : props.paid,
            date: props.date,
            hours: props.hours,
            purpose: props.event
          }
          this.modal = props.modalInteract;
        }

        render() {
          return(
            <tr
            className="VHviewRow"
            onClick={e => {
              const arg = (<EditHourEntry
                modalInteract={this.modal}
                paid={this.state.paid}
                id={this._id}
                numHours={this.state.hours}
                purpose={this.state.purpose}
                date={this.state.date}
                reload={this.reload}
                />)
              this.modal(arg)
            }}>
              <td>
                {this.state.date.toLocaleString()}
              </td>
              <td>
                {this.state.purpose}
              </td>
              <td>
                {this.state.hours}
              </td>
              {this.state.paid ?
                <td className="paid">&#10003;</td>
                :
                <td className="unPaid">&times;</td>
              }
            </tr>
          )
        }
      }

      export default EditHours;
