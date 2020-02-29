import React from 'react';
import { getState } from 'statezero';
import { Link } from 'react-router-dom';

import '../CSS/NavbarGeneric.css';

import { logout } from '../../Actions/auth.js';

class NavbarGeneric extends React.Component {
  render(){
    let type = "";
    switch(getState('uType')) {
      case 1:
        type = "administrator";
        break
      case 2:
        type = "teacher";
        break;
      case 3:
        type = "volunteer";
        break;
      default:
        type = "student";
    }
    return(
      <React.Fragment>
        <div id='topBar' className={`${type}`}>
          <Link to={`/${type.charAt(0)}/`} id='typer' onClick={e => {
            console.log('Back to dashboard');
          }}>{type}</Link>
          <Link to='/' id='logoutB' onClick={e => {
            logout()
          }}>Logout</Link>
        </div>
      </React.Fragment>
    );
  }
}

export default NavbarGeneric;
