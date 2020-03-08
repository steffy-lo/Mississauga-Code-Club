import React from 'react';
import { Link } from 'react-router-dom';

import '../CSS/Util/NavbarGeneric.css';
import "../CSS/Common.css";

import { logout } from '../../Actions/auth.js';
import { getUserTypeExplicit } from '../../Actions/utility.js';

class NavbarGeneric extends React.Component {
  render(){
    let type = getUserTypeExplicit();
    return(
      <div id="topBarWrapper">
        <div id='topBar'>
          <Link to={`/${type.charAt(0)}/`} id='typer' onClick={e => {
            console.log('Back to dashboard');
          }}>{type}</Link>

           <Link to='/' id='logoutB' onClick={e => {
            logout()
          }}>Logout</Link>


        </div>
        <div id="underWrapper" className={`${type}NBG`} />
      </div>
    );
  }
}

export default NavbarGeneric;
