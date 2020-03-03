import React from "react";
import { setState, action, subscribe } from 'statezero';
import {TextField, Button} from '@material-ui/core';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './HoursForm.css';
class HoursForm extends React.Component {
    state={
        from:0,
        to:0
    }

    setDate = function(date, name){
      this.setState({
        [name]: date
      });
    };


    render() {
        const { onButtonClick, value, name} = this.props;



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
                    <Button onClick={()=>onButtonClick(this, this.state)}>
                    Check Work Hours
                    </Button>
                    </div>

                </div>
            </div>
          );
    }
}

export default HoursForm;
