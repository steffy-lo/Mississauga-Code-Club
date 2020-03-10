import React from 'react';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { checkIn } from '../../Actions/admin';

import "../CSS/Admin/CheckIn.css";

class CheckIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      paid: true,
      reason: "",
      numHours: "",

      userRole: "",
      userName: "",

      modalWindow: "",
      isVolunteer: 0,
      submittable: 1
    }
    this.clearParams = () => {
      this.setState({
        email: "",
        paid: 1,
        reason: "",
        numHours: "",
        userName: "",
        userRole: "",
        isVolunteer: "",
        submittable: 1
      })
    };
  }

  _generateModal(title, text) {
    return (
      <StatusModal
        title={title}
        text={text}
        onClose={this.clearParams}
        colourScheme="adminStyle"/>
    )
  }

  render() {
    return(
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric/>
        <div className="absolute fillContainer flex verticalCentre">
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
                    modalWindow:
                      <StatusModal title="Check-in successful"
                        onClose={() => this.setState({modalWindow: ""})}
                        text={`Signed it at ${dateStamp.toLocalTimeString()}
                          on ${dateStamp.toLocalDateString()}`}/>
                  })})
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
                            <StatusModal
                              title="Checki-In Failed"
                              text={err.msg}
                              onClose={clFunc}
                            />
                        })
                      }
                  })
                }}>
                <span><b>Email</b>:&nbsp;
                <input
                  autoFocus={true}
                  type="email"
                  value={this.state.email}
                  onChange={e => this.setState({email: e.target.value})}/>
                </span>
                {/*}<button type="submit" onClick={e => {
                    //axios.get("/api/gcUser")
                  }}>
                  Confirm
                </button>*/}
              </form>

              <form id="checkInMCDetailsForm">

                {/*}<div id="checkInMCDetailsHeader">
                  <div>
                    Role: {this.state.userRole}
                  </div>
                  <div>
                    Name: {this.state.userName}
                  </div>
                </div>*/}

                <div id="checkInMCDetailsMain">
                  <div id="detailPaidSelector">
                    <h2>
                      Type of Work:
                    </h2>
                    <input type="radio" value="1"
                      disabled={!this.state.submittable}
                      checked={this.state.paid === true}
                      onChange={e => this.setState({paid: true})}
                      readOnly={this.state.isVolunteer}/>
                    <label htmlFor="0">Teaching</label>
                    <br />
                    <input type="radio" value="0"
                      disabled={!this.state.submittable}
                      checked={this.state.paid === false}
                      onChange={e => this.setState({paid: false})}
                      readOnly={this.state.isVolunteer}/>
                    <label htmlFor="1">Volunteering</label>
                    <br />
                  </div>
                  <div id="detailEventSelector">
                    <h2>
                      Details:
                    </h2>
                    <input type="text" placeholder="reason"
                      value={this.state.reason}
                      onChange={e=> this.setState({reason: e.target.value})}
                      disabled={!this.state.submittable}>
                    </input>
                    <input type="number" placeholder="hours"
                      step="0.25" value={this.state.numHours}
                      onChange={e=> {this.setState({numHours: e.target.value})}}
                      disabled={!this.state.submittable}>
                    </input>
                  </div>
                </div>

                <div id="mcwButtons">
                  <button type="submit"
                    disabled={!this.state.submittable}
                    onClick={e => {
                      e.preventDefault();
                      const properHours = this.state.numHours -
                        this.state.numHours % 0.25;
                      this.setState({
                        email: this.state.email.trim(),
                        reason: this.state.reason.trim(),
                        numHours: properHours,
                        modalWindow:
                          <LoadingModal text="Checking in ..."/>
                      });
                      checkIn(this.state.email, this.state.reason,
                        this.state.numHours, this.state.paid)
                      .then(time => {
                        this.setState({
                          modalWindow:
                            <StatusModal
                              title="Check-in Successful"
                              text={<span>{`User: ${this.state.email}`}<br/>
                              {`checked in for ${this.state.reason}`}<br/>
                              {`at ${time}`}<br/>
                              {`for ${this.state.numHours} hours`}</span>}
                              onClose={() => {
                                this.clearParams();
                                this.setState({modalWindow: ""});
                              }}
                            />
                        })
                      })
                      .catch(err => {
                        let clFunc = () => this.setState({modalWindow: ""});
                        if (err.stat === 403) {
                          this.setState({modalWindow: ""});
                          this.setState({
                            modalWindow:
                              <LoadingModal text={
                                  <span>
                                    Invalid Login
                                    <br />
                                    Singing you out ...
                                  </span>
                              }/>
                          })
                          setTimeout(() => window.location.reload(0), 1000);
                        } else {
                          this.setState({
                            modalWindow:
                              <StatusModal
                                title="Check-in Failed"
                                text={err.msg}
                                onClose={clFunc}
                              />
                          })
                        }
                      })
                    }}>
                    {"Check-in"}
                  </button>
                  <button type="reset"
                    disabled={!this.state.submittable}
                    onClick={this.clearParams}>
                    {"Clear"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default CheckIn;
