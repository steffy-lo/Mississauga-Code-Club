import React from 'react';

import NavbarGeneric from '../Util/NavbarGeneric';
import './volunteer.css'
import Button from "@material-ui/core/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class VolunteerDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      fromDate: new Date(),
      toDate: new Date()
    }
    this.handleChangeFromDate = this.handleChangeFromDate.bind(this);
    this.handleChangeToDate = this.handleChangeToDate.bind(this);
    this.clockIn = this.clockIn.bind(this);
    this.clockOut = this.clockOut.bind(this);
  }

  clockIn() {
    const clockIn = document.createElement('h2');
    const clockingDiv = document.querySelector('.clocking');
    clockIn.appendChild(document.createTextNode('> ' + this.state.time));
    clockIn.style.color = "blue";
    clockingDiv.appendChild(clockIn);
  }

  clockOut() {
    const clockOut = document.createElement('h2');
    const clockingDiv = document.querySelector('.clocking');
    clockOut.appendChild(document.createTextNode('< ' + this.state.time));
    clockOut.style.color = "red";
    clockingDiv.appendChild(clockOut);
  }

  handleChangeFromDate = date => {
    this.setState({fromDate: date})
  }

  handleChangeToDate = date => {
    this.setState({toDate: date})
  }

  componentDidMount() {
    this.intervalID = setInterval(() => 
      this.tick(), 1000
    )
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  tick() {
    this.setState({
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    })
  }
  
  render() {
    return(
      <React.Fragment>
      <NavbarGeneric/>
        {/* This is the volunteer dashboard. */}
        <div className="container">
          <div className="clocking">
            <h2 className="date">{this.state.date}</h2>
            <h1 className="time">{this.state.time}</h1>
            <Button onClick={this.clockIn}>Clock In</Button>
            <Button onClick={this.clockOut}>Clock Out</Button>
          </div>
          <div className="check-hours">
            <h2>Volunteer Hours</h2>
            <h3>From</h3>
            <DatePicker selected={this.state.fromDate} onChange={this.handleChangeFromDate} />
            <h3>To</h3>
            <DatePicker selected={this.state.toDate} onChange={this.handleChangeToDate} />
            <br/>
            <Button>Check</Button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default VolunteerDash;
