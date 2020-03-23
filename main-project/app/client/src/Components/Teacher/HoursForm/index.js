import React from "react";
import axios from "axios";

import { setState, action, subscribe } from 'statezero';
import {TextField, Button} from '@material-ui/core';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './HoursForm.css';

/* For local debugging */
const DEBUG = 1;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

class HoursForm extends React.Component {
    state={
        from:0,
        to:0,
        email: ""
    }

    setDate = function(date, name){
      this.setState({
        [name]: date
      });
    };

    componentDidMount(){

    }

    getWorkHours(){
        const currentComponent = this;
        console.log(this.state.email)


        axios.post(PREFIX + '/api/gethours' , {email: this.state.email})
            .then(function (response) {
                // handle success
                console.log("response", response)
                // const classes = response.data.instructor;
                // const enrolled = [];
                // const completed = [];

                // Update state
                // for (let i = 0; i < classes.length; i++) {
                //     if (classes[i].ongoing) {
                //         enrolled.push({'courseName': classes[i].name})
                //     } else {
                //         completed.push({'courseName': classes[i].name})
                //     }
                // }
                //currentComponent.setState({'coursesTeaching': enrolled, 'coursesCompleted': completed});

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

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
                    <Button onClick={()=>onButtonClick(this, this.state, email)}>
                    Check Work Hours
                    </Button>
                    <Button onClick={()=>this.getWorkHours()}>
                    Test Route
                    </Button>
                    </div>

                </div>
            </div>
          );
    }
}

export default HoursForm;
