import React from "react";
import { setState, action, subscribe } from 'statezero';
import { Link } from 'react-router-dom';


class EnrolledStudent extends React.Component {

    // Contains sample data

    render() {
        const {firstName, lastName, id, courseId} = this.props;

        return (

            <Link to={`/t/course=${courseId}/student=${id}`}>

                <h4>{firstName} {lastName} </h4>
            </Link>
          );
    }
}

export default EnrolledStudent;
