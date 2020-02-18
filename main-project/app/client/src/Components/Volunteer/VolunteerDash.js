import React from 'react';
import { setState, action, subscribe } from 'statezero';

import NavbarGeneric from '../Util/NavbarGeneric';

class VolunteerDash extends React.Component {
  render() {
    setState('uType', 1)
    return(
      <React.Fragment>
      <NavbarGeneric/>
        This is the volunteer dashboard.
      </React.Fragment>
    )
  }
}

export default VolunteerDash;
