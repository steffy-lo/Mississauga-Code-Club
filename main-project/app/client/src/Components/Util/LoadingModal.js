import React from 'react';

import Loader from "./Loader";

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";

class LoadingModal extends React.Component {

  constructor(props) {
    super(props);
    this.text = props.text === null || props.text === undefined ?
      "" : props.text;
  }

  render() {
    return(
      <div id="statusModalBlackout" className="fillContainer flex verticalCentre">
        <div id="statusModalSubBlackout" className="flex horizontalCentre">
          <div id="statusModalWindow">
            <Loader />
            <p><b><i>{this.text}</i></b></p>
          </div>
        </div>
      </div>
    )
  }
}

export default LoadingModal;
