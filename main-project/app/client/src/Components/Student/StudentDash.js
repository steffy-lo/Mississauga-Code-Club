import React from 'react';
import { setState, action, subscribe } from 'statezero';

import NavBarGeneric from '../Util/NavbarGeneric';

class StudentDash extends React.Component {
  render() {
    setState('uType', 0);
    return(
      <React.Fragment>
        <NavBarGeneric />
        This is the student dashboard.
      </React.Fragment>
    )
  }
}

export default StudentDash;
