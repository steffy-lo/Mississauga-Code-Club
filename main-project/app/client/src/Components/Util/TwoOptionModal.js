import React from 'react';

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";

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
    this.colourScheme = props.colourScheme === null || props.colourScheme === undefined ?
      "defaultStatusButton" : props.colourScheme;
    this.textB = props.textB;
  }

  render() {
    return(
      <div id="statusModalBlackout" className="fillContainer flex verticalCentre">
        <div id="statusModalSubBlackout" className="flex horizontalCentre">
          <div id="statusModalWindow">
            <h1>{this.title}</h1>
            <p>{this.text}</p>
            <div id="op2ButtonWrapper">
              <button className={`${this.colourScheme}`}
              onClick={e => this.onA()}>
                OK
              </button>
              <button className={`${this.colourScheme}`}
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
