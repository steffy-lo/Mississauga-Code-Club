import React from 'react';
import { Link } from 'react-router-dom';

import NavbarGeneric from '../Util/NavbarGeneric';
import CheckIn from './CheckIn';

class AdminDash extends React.Component {
  render() {
    return(
      <React.Fragment>
      <NavbarGeneric/>
        This is the admin dashboard.
        <Link to="/a/checkIn">Go to Check-In</Link>
      </React.Fragment>
    )
  }
}

export default AdminDash;
