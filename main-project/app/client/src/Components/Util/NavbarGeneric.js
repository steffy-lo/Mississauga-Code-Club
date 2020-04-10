import React from 'react';
import { Link } from 'react-router-dom';

import '../CSS/Util/NavbarGeneric.css';
import "../CSS/Common.css";

import { logout } from '../../Actions/auth.js';
import { getUserTypeExplicit } from '../../Actions/utility.js';

/**
 * Generic Navigation bar present on each and every view, aside from login.
 * + Contains help button zone & crumbs section, if given.
 *
 * PROPS EXPECTED (OPTIONAL):
 *  crumbs: FORMAT: [{tag: <text:String>, link: <link:String>}] (link is optional).
 *  To be used to populate the crumbs section of the navbar.
 *  help: FORMAT: <button:JSX> SHOULD call a modal that display help Information
 *  relevant to the current view.
 *
 * @extends React
 */
class NavbarGeneric extends React.Component {

  constructor(props) {
    super(props);
    this.crumbs = props.crumbs instanceof Array ? props.crumbs : [];
    this.help = props.help === undefined || props.help === null ? "" : props.help;
  }

  /*
    Generates the displayed list of crumbs, if it exists, from the prop given.
    Crumbs refer to the chain of links back to the dashboard from the current view.
   */
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
            }}>{type === "administrator" ? "admin" : type }</Link>

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
        <div id="helpWrapper" className={`${type}InnerButton`}>
          {this.help}
        </div>
      </div>
    );
  }
}

export default NavbarGeneric;
