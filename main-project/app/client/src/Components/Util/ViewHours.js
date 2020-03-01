import React from 'react';
import { Link } from 'react-router-dom';
import { uid } from 'react-uid';

import NavbarGeneric from '../Util/NavbarGeneric';

import { getUserTypeExplicit } from '../../Actions/utility.js';

import "../CSS/Util/ViewHours.css";
import "../CSS/Common.css";

class ViewHours extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalWindow: "",
      fullList: [],
      deployedList: ""
    };
    this.uTE = getUserTypeExplicit();
    this.criterion = () => true;
    this.refList = [];
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
                  <div>Hours Worked</div>
                  {(this.uTE !== "administrator") ? "" :
                  (<Link className={`${this.uTE}VH`}
                    to="/" >Edit Hours</Link>)
                  }
                </div>
                <table id="VHviewTableHeader">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Purpose</th>
                      <th>Hours</th>
                      <th>Paid</th>
                    </tr>
                  </thead>
                </table>
                <div id="scrollableHoursPane">
                  <table id="VHviewTable">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Purpose</th>
                        <th>Hours</th>
                        <th>Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      <HoursRow date="0" p="No" hours={6.75} paid={1}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={null}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={1}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={1}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={1}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={1}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={null}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={null}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={null}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={null}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={null}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={null}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={null}/>
                      <HoursRow date="0" p="No" hours={6.75} paid={null}/>
                    </tbody>
                  </table>
                </div>
                <div>
                  
                </div>
              </div>
            </div>
          </div>
      </React.Fragment>
    );
  }

  generateHoursRows() {
    const compiledList = [];
    for (let record of this.state.fullList) {
      compiledList.append(
        <HoursRow key={uid()} date={record.date} p={record.purpose}
          hours={record.hours} paid={record.isPaid} />
      )
    }
    this.setState({deployedList: compiledList})
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
    this.p = props.p;
  }

  setVisiblity(isVisible) {
    const v = isVisible ? "shown" : "hidden";
    this.setState({isVisible: v});
  }

  getStats() {
    return [this.date, this.p, this.hours, this.paid];
  }

  render() {
    return(
      <tr className="VHviewRow">
        <td>{this.date}</td>
        <td>{this.p}</td>
        <td>{this.hours}</td>
        {this.paid ? <td className="paid">&#10003;</td> :
          <td className="unPaid">&times;</td> }
      </tr>
    )
  }
}

export default ViewHours;
