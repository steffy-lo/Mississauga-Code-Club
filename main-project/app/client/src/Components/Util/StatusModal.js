import React from 'react';

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";

class StatusModal extends React.Component {

  constructor(props) {
    super(props);
    console.log(props.colourScheme);
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
    return(
      <div id="statusModalBlackout" className="fillContainer flex verticalCentre">
        <div id="statusModalSubBlackout" className="flex horizontalCentre">
          <div id="statusModalWindow">
            <h1>{this.title}</h1>
            <p>{this.text}</p>
            <button className={`${this.colourScheme}`}
            onClick={e => this.onClose()}>
              OK
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default StatusModal;
