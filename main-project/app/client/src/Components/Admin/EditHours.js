import React from 'react';

import StatusModal from '../Util/StatusModal';
import TwoOptionModal from '../Util/TwoOptionModal';
import LoadingModal from '../Util/LoadingModal';

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";
import "../CSS/Admin/EditHours.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class EditHours extends React.Component {

    constructor(props) {
        super(props);
        this.onClose = props.onClose;
        this.state = {
            toDisplay: null,
            paid: props.text === null || props.text === undefined ? null : props.paid,
            numHours: props.numHours === null || props.numHours === undefined ? 0 : props.numHours,
            purpose: props.purpose === null || props.purpose === undefined ? "" : props.purpose,
            date: props.text === null || props.text === undefined ? null : props.date,
            submittable: 1
        }
        this.saveChanges = this.saveChanges.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }

    saveChanges() {

    }

    deleteRecord() {

    }

    render() {
        if (this.state.toDisplay === null) {
            return (
                <div id="statusModalBlackout" className="fillContainer flex verticalCentre">
                    <div id="statusModalSubBlackout" className="flex horizontalCentre">
                        <div id="statusModalWindow">
                            <h1>Edit Hours Record</h1>
                            <span>Date & Time:&nbsp;
                                <DatePicker id='date' onChange={(date)=>this.setState({date: date})} selected={this.state.date}>
                                    </DatePicker>
                                </span>
                            <div id="wrapper">
                                <div className="left">
                                <span>Hours:&nbsp;
                                    <input type="number"
                                           step="0.25" value={this.state.numHours}
                                           onChange={e=> {this.setState({numHours: e.target.value})}}
                                           disabled={!this.state.submittable}
                                    />
                                </span>
                                </div>
                                <div className="right">
                                    <span>Purpose:&nbsp;
                                        <input type="text"
                                               value={this.state.purpose}
                                               onChange={e=> this.setState({purpose: e.target.value})}
                                               disabled={!this.state.submittable}
                                        />
                                    </span>
                                    <span>
                                        <span>
                                        <input type="radio" id="paid" value="paid"
                                               checked={this.state.paid === true}
                                               onChange={e => this.setState({paid: true})}/>
                                        <label htmlFor="paid">Paid</label>
                                        </span>
                                        <span>
                                        <input type="radio" id="volunteer" value="volunteering"
                                               checked={this.state.paid === false}
                                               onChange={e => this.setState({paid: false})} />
                                        <label htmlFor="female">Volunteering</label>
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div className="buttonSectionWrapper">
                                <button className="adminStyle" onClick={e => {this.saveChanges()}}> Save Changes </button>
                                <button className="adminStyle" onClick={e => {this.deleteRecord()}}> Delete Record </button>
                                <button className="adminStyle"
                                        onClick={e => this.onClose()}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return this.state.toDisplay;
        }
    }
}

export default EditHours;