import React from 'react';

import NavbarGeneric from '../Util/NavbarGeneric';
import './volunteer.css'
import Button from "@material-ui/core/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

class VolunteerDash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            fromDate: new Date(),
            toDate: new Date(),
            clockedIn: null
        };
        this.handleChangeFromDate = this.handleChangeFromDate.bind(this);
        this.handleChangeToDate = this.handleChangeToDate.bind(this);
        this.clockIn = this.clockIn.bind(this);
        this.clockOut = this.clockOut.bind(this);
  }

  clockIn() {
      const clockingDiv = document.querySelector('.clocking');
      if (clockingDiv.lastChild.className === "clockedOut") {
          clockingDiv.removeChild(clockingDiv.lastChild); // remove clockedOut element
          clockingDiv.removeChild(clockingDiv.lastChild); // remove clockedIn element
      }
      if (this.state.clockedIn === null) {
          const clockIn = document.createElement('h3');
          clockIn.className = "clockedIn";
          const clockedIn = this.state.time;
          clockIn.appendChild(document.createTextNode('> ' + clockedIn));
          this.setState({'clockedIn': new Date()});
          clockIn.style.color = "blue";
          clockingDiv.appendChild(clockIn);
      }

  }

  clockOut() {
      const clockingDiv = document.querySelector('.clocking');
      if (this.state.clockedIn !== null) {
          const clockOut = document.createElement('h3');
          clockOut.className = "clockedOut";
          const clockedOut = this.state.time;
          clockOut.appendChild(document.createTextNode('< ' + clockedOut));
          this.setState({'clockedIn': null});
          axios.post(PREFIX + '/clockhours', {
              date: this.state.date,
              hours: (new Date() - this.state.clockedIn) / 36e5
          })
              .then(function (response) {
                  console.log(response);
              })
              .catch(function (error) {
                  console.log(error);
              });
          clockOut.style.color = "red";
          clockingDiv.appendChild(clockOut);
      }
  }

  handleChangeFromDate = date => {
    this.setState({fromDate: date})
  };

  handleChangeToDate = date => {
    this.setState({toDate: date})
  };

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
        <div className="volunteer-container">
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
