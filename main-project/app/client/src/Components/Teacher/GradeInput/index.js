import React from "react";
import { setState, action, subscribe } from 'statezero';
import { Link } from 'react-router-dom';
import NavbarGeneric from '../../Util/NavbarGeneric';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import './GradeInput.css';

class GradeInput extends React.Component {

    state = {
        value:""

    }

    renderGradeOptions(){
        const grades = [1, 2, 3, 4]
        return grades.map((grade, index) => (<MenuItem value={grade} key={index}>{grade}</MenuItem>))
    }

    render() {
        const {name, value, onChange} = this.props


        return (
            <div className="form-field">
                <h5>{name}</h5>
                <TextField
                className="input"
                select
                selected={this.state.value}
                onChange={(event)=>onChange(event, name)}
                >

                    {this.renderGradeOptions()}
                </TextField>
            </div>

          );
    }
}

export default GradeInput;
