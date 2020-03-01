import React from 'react';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';

import "../CSS/Admin/CheckIn.css";

class CheckIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      userType: "",
      paid: 0,
      activity: "",
      modalWindow: "",
      waitingEmail: 0,
      waitingSubmitted: 0,
      detailsForm: ""
    }
  }

  componentDidMount() {
    // this.setState({modalWindow: this._generateModal("Success", "User A is now checked-in for <x> at <y>."),
    // detailsForm: this._generateDetailsForm(1, null, null)});
    this.setState({detailsForm: this._generateDetailsForm(1, null, null)});

  }

  _generateModal(title, text) {
    return (
      <StatusModal title={title} text={text} onClose={() => {
          this.setState({modalWindow: ""})
        }} colourScheme="adminStyle"/>
    )
  }

  _generateDetailsForm(status, userDetails, options) {
    if (status === 1 || status === 2) {
      const readonly = status === 1;
      return (
        <form id="checkInMCDetailsForm">
          <div id="checkInMCDetailsHeader">
            <div id="ciMCDHTyper">Type: <span></span></div>
            <div id="ciMCDHName">Name: <span></span></div>
          </div>
          <div id="checkInMCDetailsMain">
            <fieldset id="detailPaidSelector">
              <legend>Type of Work</legend>
              <input type="radio" name="work" value="paid"/>
              <label htmlFor="paid">Paid</label><br />
              <input type="radio" name="work" value="unpaid"/>
              <label htmlFor="unpaid">Unpaid</label><br />
            </fieldset>
            <hr />
            <fieldset id="detailEventSelector">
              <legend>Event</legend>
              <input type="text" placeholder=""></input>
            </fieldset>
          </div>
          <div id="mcwButtons">
            <button type="submit">{"Check-in"}</button>
            <hr />
            <button type="reset">{"Clear"}</button>
          </div>
        </form>
      )
    } else {
      return {

      }; //Loader.
    }
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
                <form id="checkInMCSelectorForm" onSubmit={e => {
                    e.preventDefault();
                    console.log("Fetch target");
                  }}>
                  <input type="email" placeholder="email" value={this.state.email}
                    onChange={e => this.setState({email: e.target.value})}/>
                  <hr />
                  <button type="submit">Confirm</button>
                </form>
                {this.state.detailsForm}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default CheckIn;
