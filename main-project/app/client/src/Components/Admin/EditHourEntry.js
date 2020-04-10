import React from "react";

import StatusModal from "../Util/StatusModal";
import LoadingModal from "../Util/LoadingModal";

import { editHours, deleteHoursEntry } from "../../Actions/admin";
import { genUniversalDate } from "../../Actions/utility";

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";
import "../CSS/Admin/EditHours.css";

import "react-datepicker/dist/react-datepicker.css";

/**
 * MODAL VIEW
 * For editing an individual entry in a user's log of hours.
 * FUNCTIONALITY: MODIFY and SAVE the details of a some hours entry.
 * EXPECTS PROPS
 *  modal: FUNCTION | SHOULD be used for setting state of the view this modal is attached to.
 *  id: STRING | The HoursEntry ID of the entry that we wish to edit.
 *  reload: FUNCTION | SHOULD be used for reloading the data in the view this moadl is attached to.
 *  paid, date, numHours, purpose: Attributes of the hours entry to be edited.
 *    IN ORDER; TYPES: BOOLEAN OR NULL, (TIME)STRING, INT, STRING
 * CONTEXT: Admin only.
 *  Connected to/called by every displayed hours entry in the table in that view
 *  (ONCLICK).
 *
 * @extends React
 */
class EditHourEntry extends React.Component {
  constructor(props) {
    super(props);
    this.modal =
      props.modalInteract === null || props.modalInteract === undefined
        ? e => true
        : props.modalInteract;
    this.id = props.id;
    this.reload =
      props.reload === null || props.reload === undefined
        ? e => true
        : props.reload;
    const full_date =
      props.date === null || props.date === undefined ? new Date() : props.date;
    this.state = {
      paid: props.paid === null || props.paid === undefined ? null : props.paid,
      numHours:
        props.numHours === null || props.numHours === undefined
          ? 0
          : props.numHours,
      purpose:
        props.purpose === null || props.purpose === undefined
          ? ""
          : props.purpose,
      date: genUniversalDate(full_date),
      time: full_date.getHours() + ":" + full_date.getMinutes(),
      submittable: 1
    };
  }

  /* Does what it says on the tin. */
  saveChanges() {
    const composeObj = {
      paid: this.state.paid,
      hours: this.state.numHours,
      purpose: this.state.purpose,
      dateTime: new Date(this.state.date + " " + this.state.time).toISOString()
    };
    // See ACTIONS:admin.js, editHours for more information.
    this.modal(<LoadingModal text="Applying changes ..." />);
    editHours(this.id, composeObj)
      .then(success => {
        this.modal("");
        this.reload();
        // this.modal("")
      })
      .catch(err => {
        if (err.stat === 403) {
          this.modal(
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
          );
          setTimeout(() => window.location.reload(0), 1000);
        } else {
          this.modal(
            <StatusModal
              title="Changes Could Not Be Saved"
              text={err.msg}
              onClose={() => {
                this.modal("");
              }}
            />
          );
        }
      });
  }

  /* These tins are labelled for your viewing pleasure. */
  deleteRecord() {
    // See ACTIONS:admin.js, deleteHoursEntry for more information.
    deleteHoursEntry(this.id)
      .then(s => {
        this.modal(
          <StatusModal
            title="Record Successfully Deleted"
            text={`Succesfully deleted record with id ${this.id}`}
            onClose={() => {
              //Clear modal and reload information.
              this.modal("");
              this.reload();
            }}
          />
        );
      })
      .catch(err => {
        if (err.stat === 403) {
          this.modal(
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
          );
          setTimeout(() => window.location.reload(0), 1000);
        } else {
          this.modal(
            <StatusModal
              title="Record Could Not Be Deleted"
              text={err.msg}
              onClose={() => {
                this.modal(this);
              }}
            />
          );
        }
      });
  }

  render() {
    return (
      <div
        id="statusModalBlackout"
        className="fillContainer flex verticalCentre"
      >
        <div id="statusModalSubBlackout" className="flex horizontalCentre">
          <div id="statusModalWindow">
            <h1>Edit Hours Record</h1>
            {/*
              Lots of wrappers, to align things by means of flexbox.
              Inputs located below.
              All controlled.
            */}
            <div id="EHwrapper">
              <div id="EHwrapperLeft">
                <div id="EHModalID">
                  ID:&nbsp;
                  <input type="text" disabled value={this.id} />
                </div>
                <div>
                  Date:&nbsp;
                  <input
                    type="date"
                    value={this.state.date}
                    onChange={e => {
                      this.setState({ date: e.target.value });
                      console.log(
                        new Date(this.state.date + " " + this.state.time)
                      );
                    }}
                  />
                </div>
                <div>
                  Time:&nbsp;
                  <input
                    type="time"
                    value={this.state.time}
                    onChange={e => {
                      this.setState({ time: e.target.value });
                      console.log(e.target.value);
                    }}
                  />
                </div>
                Hours:&nbsp;
                <input
                  type="number"
                  size="9"
                  step="0.25"
                  value={this.state.numHours}
                  onChange={e => {
                    this.setState({ numHours: e.target.value });
                  }}
                  disabled={!this.state.submittable}
                />
              </div>
              <div id="EHwrapperRight">
                <div id="EHSpacer">
                  <input type="text" disabled value={""} />
                </div>
                <div>
                  Purpose:&nbsp;
                  <input
                    type="text"
                    value={this.state.purpose}
                    onChange={e => this.setState({ purpose: e.target.value })}
                    disabled={!this.state.submittable}
                  />
                </div>
                <div id="EHWrapperRadioB">
                  <span>
                    <input
                      type="radio"
                      id="paid"
                      value="paid"
                      checked={this.state.paid === true}
                      onChange={e => this.setState({ paid: true })}
                    />
                    <label htmlFor="paid">Paid</label>
                  </span>
                  <span>
                    <input
                      type="radio"
                      id="volunteer"
                      value="volunteering"
                      checked={this.state.paid === false}
                      onChange={e => this.setState({ paid: false })}
                    />
                  <label htmlFor="volunteer">Volunteering</label>
                  </span>
                </div>
              </div>
            </div>
            {/* Function buttons */}
            <div className="buttonSectionWrapper">
              <button
                className="adminStyle"
                onClick={e => {
                  this.saveChanges();
                }}
              >
                {" "}
                Save Changes{" "}
              </button>
              <button
                className="adminStyle"
                onClick={e => {
                  this.deleteRecord();
                }}
              >
                {" "}
                Delete Record{" "}
              </button>
              <button className="adminStyle" onClick={e => this.modal("")}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditHourEntry;
