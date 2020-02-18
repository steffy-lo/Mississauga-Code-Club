import React from 'react';
import { setState, action, subscribe } from 'statezero';

import NavbarGeneric from '../Util/NavbarGeneric';

class TeacherDash extends React.Component {
  render() {
    setState('uType', 2);
    return(
      <React.Fragment>
        <NavbarGeneric/>
        This is the teacher dashboard.
      </React.Fragment>
    )
  }
}

export default TeacherDash;
