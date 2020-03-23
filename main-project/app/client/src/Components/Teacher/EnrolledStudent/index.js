import React from "react";
import { setState, action, subscribe } from 'statezero';
import { Link } from 'react-router-dom';


class EnrolledStudent extends React.Component {

    

    render() {
        const {firstName, lastName, email, courseId} = this.props;

        return (

            <Link to={`/t/course=${courseId}/student=${email}`}>

                <h4>{firstName} {lastName} </h4>
            </Link>
          );
    }
}

export default EnrolledStudent;
