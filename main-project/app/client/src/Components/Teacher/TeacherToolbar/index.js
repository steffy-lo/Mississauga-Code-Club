import React from 'react';
import { setState, action, subscribe } from 'statezero';
import { uid } from "react-uid";
import {AppBar, Toolbar, Button} from "@material-ui/core";

class TeacherToolbar extends React.Component {
    render() {
        const {handleButtonSelect} = this.props;
        return (
            <Toolbar name="toolbarSelection">
                <Button variant="outlined" color="inherit" onClick={() => handleButtonSelect("courses")}

                >
                    Courses

                </Button>
                <Button variant="outlined" color="inherit" onClick={() => handleButtonSelect("hours")}

                >
                    Work Hours
                </Button>
            </Toolbar>
          );
    }
}

export default TeacherToolbar
