import React from 'react';

import NavbarGeneric from '../Util/NavbarGeneric';

class AdminDash extends React.Component {
  render() {
    return(
      <React.Fragment>
      <NavbarGeneric/>
        This is the admin dashboard.
      </React.Fragment>
    )
  }
}

export default AdminDash;
