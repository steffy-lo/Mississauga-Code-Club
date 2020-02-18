import React from 'react';
import { getState, action, subscribe } from 'statezero';

import '../CSS/NavbarGeneric.css';

import { Link } from 'react-router-dom';

class NavbarGeneric extends React.Component {
  render(){
    let type = "";
    switch(getState('uType')) {
      case 1:
        type = "volunteer";
        break
      case 2:
        type = "teacher";
        break;
      case 3:
        type = "administrator";
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
            console.log('Logged out, I guess.');
          }}>Logout</Link>
        </div>
      </React.Fragment>
    );
  }
}

export default NavbarGeneric;
