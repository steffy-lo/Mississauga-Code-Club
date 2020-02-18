import React from 'react';
import {setState, action, subscribe } from 'statezero';

import NavbarGeneric from '../Util/NavbarGeneric';

class AdminDash extends React.Component {
  render() {
    setState('uType', 3);
    return(
      <React.Fragment>
      <NavbarGeneric/>
        This is the admin dashboard.
      </React.Fragment>
    )
  }
}

export default AdminDash;
