import React from 'react';

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";
import { getUserTypeExplicit } from '../../Actions/utility.js';

class StatusModal extends React.Component {

  constructor(props) {
    super(props);
    this.title = props.title === null || props.title === undefined ?
      "" : props.title;
    this.text = props.text === null || props.text === undefined ?
      "" : props.text;
    this.onClose = props.onClose === null || props.onClose === undefined ?
      () => true : props.onClose;
    this.colourScheme = props.colourScheme === null || props.colourScheme === undefined ?
      "defaultStatusButton" : props.colourScheme;
  }

  render() {
    let type = getUserTypeExplicit();
    return(
      <div id="statusModalBlackout" className="fillContainer flex verticalCentre">
        <div id="statusModalSubBlackout" className="flex horizontalCentre">
          <div id="statusModalWindow" className={`${type}InnerButton`}>
            <h1>{this.title}</h1>
            <p>{this.text}</p>
            <button onClick={e => this.onClose()}>
              OK
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default StatusModal;
