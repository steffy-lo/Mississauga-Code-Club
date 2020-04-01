import React from 'react';
import { Link } from 'react-router-dom';

import '../CSS/Util/NavbarGeneric.css';
import "../CSS/Common.css";

import { logout } from '../../Actions/auth.js';
import { getUserTypeExplicit } from '../../Actions/utility.js';

class NavbarGeneric extends React.Component {

  constructor(props) {
    super(props);
    this.crumbs = props.crumbs instanceof Array ? props.crumbs : [];
  }

  generateCrumbs() {
    const compiledCrumbs = [];
    let ticker = 0;
    for (let crumbPair of this.crumbs) {
      if (crumbPair instanceof Object && 'tag' in crumbPair) {
        ticker++;
        let compObj = null;
        if ('link' in crumbPair) {
          compObj = (
            <Link
            key={ticker}
            className="crumbTag"
            to={`${crumbPair.link}`}>
            {crumbPair.tag}
          </Link>)
        } else {
          compObj = (
            <span key={ticker} className="crumbTag">
            {crumbPair.tag}
          </span>)
        }
        compiledCrumbs.push(compObj);
        compiledCrumbs.push(<b key={++ticker}>></b>);
      }
    }
    compiledCrumbs.pop();
    return compiledCrumbs;
  }

  render(){
    let type = getUserTypeExplicit();
    return(
      <div id="preTopWrapper">
        <div id="topBarWrapper">
          <div id='topBar'>
            <Link to={`/${type.charAt(0)}/`} id='typer' onClick={e => {
              console.log('Back to dashboard');
            }}>{type}</Link>

          <span id='logoutB' onClick={e => {
              logout().then(() => {
              console.log("Logged out, I guess")
              window.location.reload(0)
              })
            }}>Logout</span>


          </div>
          <div id="underWrapper" className={`${type}NBG`} />

        </div>
        <div id="crumbsWrapper">
          {this.generateCrumbs()}
        </div>
      </div>
    );
  }
}

export default NavbarGeneric;
