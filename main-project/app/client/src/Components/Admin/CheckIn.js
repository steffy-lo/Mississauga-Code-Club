import React from "react";

import NavbarGeneric from "../Util/NavbarGeneric";
import StatusModal from "../Util/StatusModal"; // May not be needed anymore
import LoadingModal from "../Util/LoadingModal";

import HelpButton from "../Util/HelpButton";

/* Function used for checking in */
import { checkIn } from "../../Actions/admin";

import "../CSS/Admin/CheckIn.css";

/**
 * View for checking in.
 * FUNCTIONALITY: ALLOW a user to check in, by providing their email,
 *                reason for signing in & expected number of hours.
 * CONTEXT: An admin leaves this view open for others to use to check in.
 *          Ergo, all checking in is to be done on-site.
 *
 *
 * @extends React
 */
class CheckIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Check-in details.
      email: "",
      paid: true,
      reason: "",
      numHours: "",

      //For modal views.
      modalWindow: ""
    };

    //Used for resetting.
    this.clearParams = () => {
      this.setState({
        email: "",
        paid: true,
        reason: "",
        numHours: ""
      });
    };
  }

  /**
   * HELPER FUNCTION.
   * Generate a STATUS MODAL window with the give message and title.
   * DOES NOT automatically insert this modal into the view.
   *
   * @param  {[String]} title The title of the STATUS MODAL window.
   * @param  {[String]} text  The message of the STATUS MODAL window.
   * @return {[StatusModal:React.Component]}
   *  A STATUS MODAL window with the given title and message.
   */
  _generateModal(title, text) {
    return (
      <StatusModal
        title={title}
        text={text}
        onClose={this.clearParams}
        colourScheme="adminStyle"
      />
    );
  }

  render() {
    const navList = [{ tag: "Dashboard", link: "/a/" }, { tag: "Check-In" }];
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric crumbs={navList}
	    help={
                <HelpButton
                      text={
                        <div>
                          The admin should leave this page open.
                          <br />
                          Then, any person who wishes to sign in should
                          input their email address, the reason they are present,
                          whether their presence is for volunteering or teaching
                          (where teaching is paid & volunteering is not) & how long
                          they will be present for.
                        </div>
			      }
                      parentForClose = {this}
                    />
		}
	/>
        <div className="flexContentContainerGeneric">
          <div className="flex horizontalCentre">
            <div id="checkInMainWindow">
              <h1>Check-In</h1>

              <form
                id="checkInMCSelectorForm"
                onSubmit={e => {
                  e.preventDefault();
                  checkIn()
                    .then(datetime => {
                      const dateStamp = new Date(datetime);
                      this.setState({
                        modalWindow: (
                          <StatusModal
                            title="Check-in successful"
                            onClose={() => this.setState({ modalWindow: "" })}
                            text={`Signed it at ${dateStamp.toLocalTimeString()}
                          on ${dateStamp.toLocalDateString()}`}
                          />
                        )
                      });
                    })
                    .catch(err => {
                      const clFunc = () => this.setState({ modalWindow: "" });
                      if (err.stat === 403) {
                        this.setState({ modalWindow: "" });
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
                        this.setState({ modalWindow: "" });
                        this.setState({
                          modalWindow: (
                            <StatusModal
                              title="Checki-In Failed"
                              text={err.msg}
                              onClose={clFunc}
                            />
                          )
                        });
                      }
                    });
                }}
              >
                <span>
                  <b>Email</b>:&nbsp;
                  <input
                    autoFocus={true}
                    type="email"
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                  />
                </span>
              </form>

              <form id="checkInMCDetailsForm">
                <div id="checkInMCDetailsMain">
                  <div id="detailPaidSelector">
                    <h2>Type of Work:</h2>
                    <input
                      type="radio"
                      value="1"
                      checked={this.state.paid === true}
                      onChange={e => this.setState({ paid: true })}
                    />
                    <label htmlFor="0">Teaching</label>
                    <br />
                    <input
                      type="radio"
                      value="0"
                      checked={this.state.paid === false}
                      onChange={e => this.setState({ paid: false })}
                    />
                    <label htmlFor="1">Volunteering</label>
                    <br />
                  </div>
                  <div id="detailEventSelector">
                    <h2>Details:</h2>
                    <input
                      type="text"
                      placeholder="reason"
                      value={this.state.reason}
                      onChange={e => this.setState({ reason: e.target.value })}
                    ></input>
                    <input
                      type="number"
                      placeholder="hours"
                      step="0.25"
                      value={this.state.numHours}
                      onChange={e => {
                        this.setState({ numHours: e.target.value });
                      }}
                    ></input>
                  </div>
                </div>

                <div id="mcwButtons">
                  <button
                    type="submit"
                    onClick={e => {
                      e.preventDefault();
                      const properHours =
                        this.state.numHours - (this.state.numHours % 0.25);
                      this.setState({
                        email: this.state.email.trim(),
                        reason: this.state.reason.trim(),
                        numHours: properHours,
                        modalWindow: <LoadingModal text="Checking in ..." />
                      });
                      checkIn(
                        this.state.email,
                        this.state.reason,
                        this.state.numHours,
                        this.state.paid
                      )
                        .then(time => {
                          const timeObj = new Date(time);
                          this.setState({
                            modalWindow: (
                              <StatusModal
                                title="Check-in Successful"
                                text={
                                  <span>
                                    {`User: ${this.state.email}`}
                                    <br />
                                    {`checked in for ${this.state.reason}`}
                                    <br />
                                    {`on ${timeObj.toDateString()}`}
                                    <br />
                                    {`at ${timeObj.toTimeString()}`}
                                    <br />
                                    {`for ${this.state.numHours} hours`}
                                  </span>
                                }
                                onClose={() => {
                                  this.clearParams();
                                  this.setState({ modalWindow: "" });
                                }}
                              />
                            )
                          });
                        })
                        .catch(err => {
                          let clFunc = () => this.setState({ modalWindow: "" });
                          if (err.stat === 403) {
                            this.setState({ modalWindow: "" });
                            this.setState({
                              modalWindow: (
                                <LoadingModal
                                  text={
                                    <span>
                                      Invalid Login
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
                                  title="Check-in Failed"
                                  text={err.msg}
                                  onClose={clFunc}
                                />
                              )
                            });
                          }
                        });
                    }}
                  >
                    {"Check-in"}
                  </button>
                  <button type="reset" onClick={this.clearParams}>
                    {"Clear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CheckIn;
