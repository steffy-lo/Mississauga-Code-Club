import React from "react";
import axios from "axios";

import { setState, action, subscribe } from 'statezero';
import {TextField, Button} from '@material-ui/core';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './HoursForm.css';
import moment from 'moment';
/* For local debugging */
const DEBUG = 1;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

const dateFormat = 'MMMM D, YYYY'

class HoursForm extends React.Component {
    state={
        from:"",
        to:"",
        hours:0,
        formSubmitted: false,
        email: ""
    }

    setDate = function(date, name){
        this.setState({
            [name]: date
        });
    };

    componentDidMount(){

    }

    // Updates state with work hours within the supplied interval
    getWorkHours(){
        const currentComponent = this;


        axios.post(PREFIX + '/api/gethours' , {email: this.state.email})
            .then(function (response) {
                // handle success
                let hours = response.data.hours

                // Keep hours within interval (from, to) in current state
                hours = hours.filter(hourEntry =>
                     (moment(hourEntry.dateTime).isAfter(currentComponent.state.from)
                     && moment(hourEntry.dateTime).isBefore(currentComponent.state.to)));

                for(let hourEntry of hours){
                    currentComponent.state.hours += hourEntry.hours;
                }
                currentComponent.state.formSubmitted = true;
                currentComponent.forceUpdate();

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }

    // Return a div containing the total hours worked
    renderHoursOutput(){
        if(this.state.formSubmitted){
            const from = moment(this.state.from).format(dateFormat).toString()
            const to = moment(this.state.to).format(dateFormat).toString()
            return (<div id='hours-output'>
                        Hours worked from {from} to {to}: {this.state.hours}
                    </div>);
        }
    }

    render() {
        const { onButtonClick, name, email} = this.props;
        this.state.email = email


        return (
            <div id="hours-form"  name={name}>
                <h2>
                Check Work Hours Accumulated
                </h2>
                <div id='form-inputs'>
                    <div className='form-input'>
                    <div className='label'>From</div>
                    <DatePicker id='hours-from'  onChange={(date)=>this.setDate(date, "from")} selected={this.state.from} >
                    </DatePicker>
                    </div>
                    <div className='form-input'>
                    <div className='label'>To</div>
                    <DatePicker id='hours-to'  onChange={(date)=>this.setDate(date, "to")} selected={this.state.to}>
                    </DatePicker>
                    </div>
                    <div className='form-input'>
                    <Button onClick={()=>this.getWorkHours()}>
                    Check Hours
                    </Button>
                    </div>

                </div>
                {this.renderHoursOutput()}
            </div>
          );
    }
}

export default HoursForm;
