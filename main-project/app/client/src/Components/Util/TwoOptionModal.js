import React from 'react';

import { getUserTypeExplicit } from '../../Actions/utility.js';

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";

/**
 * MODAL VIEW
 * Two button/option variant of the status modal (StatusModal), where the text
 * of the first button is OK & the text of the second is configurable.
 *
 * PROPS EXPECTED: <title:String>, <text:String>,
 *  <textB:String> WHERE this is the text of the second button.
 *  onA: FUNCTION | Executed when button A (OK button) is pressed.
 *  onB: FUNCTION | Executed when button B is pressed.
 *
 * Otherwise, same as StatusModal.
 *
 * NOTE: This modal is not currently used, but it is otherwise functional.
 *
 * @extends React
 */
class StatusModal extends React.Component {

  constructor(props) {
    super(props);
    this.title = props.title === null || props.title === undefined ?
      "" : props.title;
    this.text = props.text === null || props.text === undefined ?
      "" : props.text;
    this.onA = props.onA === null || props.onA === undefined ?
      () => true : props.onA;
    this.onB = props.onB === null || props.onB === undefined ?
      () => true : props.onB;
    this.textB = props.textB;
  }

  render() {
    let type = getUserTypeExplicit();
    return(
      <div id="statusModalBlackout" className="fillContainer flex verticalCentre">
        <div id="statusModalSubBlackout" className="flex horizontalCentre">
          <div id="statusModalWindow">
            <h1>{this.title}</h1>
            <p>{this.text}</p>
            <div id="op2ButtonWrapper"  className={`${type}InnerButton`}>
              <button
              onClick={e => this.onA()}>
                OK
              </button>
              <button
              onClick={e => this.onB()}>
                {this.textB}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default StatusModal;
