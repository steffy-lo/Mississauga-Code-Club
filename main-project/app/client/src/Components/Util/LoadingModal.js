import React from 'react';

import Loader from "./Loader";

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";

/*
  A simple modal window that display a message along side a loader.
  Like all other modal views, it must be set in its containing view.
  Also, no self-contained removal. Removal must be done from the containing view.

  EXPECTS PROP:
    text: The text dusokayed alongside the loader. Can be empty.
 */
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
