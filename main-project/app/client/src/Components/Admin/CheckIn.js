import React from 'react';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';

import "../CSS/Admin/CheckIn.css";

class CheckIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      paid: 1,
      reason: "",

      userRole: "",
      userName: "",

      modalWindow: "",
      isVolunteer: 0,
      submittable: 0
    }
    this.clearParams = () => {
      this.setState({
        email: "",
        paid: 1,
        reason: "",
        userName: "",
        userRole: "",
        isVolunteer: 0,
        submittable: 0
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
                  console.log("Fetch target");
                }}>
                <input
                  autoFocus={true}
                  type="email"
                  placeholder="email"
                  value={this.state.email}
                  onChange={e => this.setState({email: e.target.value})}/>

                <button type="submit" onClick={e => {
                    //axios.get("/api/gcUser")
                  }}>
                  Confirm
                </button>
              </form>

              <form id="checkInMCDetailsForm">

                <div id="checkInMCDetailsHeader">
                  <div>
                    Role: {this.state.userRole}
                  </div>
                  <div>
                    Name: {this.state.userName}
                  </div>
                </div>

                <div id="checkInMCDetailsMain">
                  <div id="detailPaidSelector">
                    <h2>
                      Type of Work:
                    </h2>
                    <input type="radio" value="1"
                      disabled={!this.state.submittable}
                      checked={this.state.paid === 1}
                      onChange={e => this.setState({paid: 1})}
                      readOnly={this.state.isVolunteer}/>
                    <label htmlFor="0">Teaching</label>
                    <br />
                    <input type="radio" value="0"
                      disabled={!this.state.submittable}
                      checked={this.state.paid === 0}
                      onChange={e => this.setState({paid: 0})}
                      readOnly={this.state.isVolunteer}/>
                    <label htmlFor="1">Volunteering</label>
                    <br />
                  </div>
                  <div id="detailEventSelector">
                    <h2>
                      Reason:
                    </h2>
                    <input type="text" placeholder="reason"
                      value={this.state.reason}
                      onChange={e=> this.setState({reason: e.target.value})}
                      disabled={!this.state.submittable}>
                    </input>
                  </div>
                </div>

                <div id="mcwButtons">
                  <button type="submit"
                    disabled={!this.state.submittable}
                    >
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
