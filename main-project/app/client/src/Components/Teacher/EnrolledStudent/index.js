import React from "react";
import { setState, action, subscribe } from 'statezero';
import { Link } from 'react-router-dom';


class EnrolledStudent extends React.Component {

    // Contains sample data

    render() {
        const {firstName, lastName, id} = this.props;

        return (

            <Link to={"/s/"+id}>

                <h4>{firstName} {lastName} </h4>
            </Link>
          );
    }
}

export default EnrolledStudent;
