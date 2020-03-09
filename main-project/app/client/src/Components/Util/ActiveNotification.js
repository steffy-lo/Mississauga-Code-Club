import React from 'react';

import Loader from "./Loader";

import "../CSS/Common.css";
import "../CSS/Util/ActiveNotification.css";

class ActiveNotification extends React.Component {

  constructor(props) {
    super(props);
    this.type = props.type
    this.text = props.text === null || props.text === undefined ?
      "" : props.text;
  }

  render() {
    if (this.type === 1) {
      return (
        <div className="flex horizontalCentre">
          <div className="activeNotCondClear">
          <p>
            <h6>&#10003;</h6>
            <span>{this.text}</span>
          </p>
          </div>
        </div>
      );
    } else if (this.type === 2) {
      return (
        <div className="flex horizontalCentre">
          <div className="activeNotCondFail">
          <p>
            <h6>&times;</h6>
            <span>{this.text}</span>
          </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex horizontalCentre">
          <div className="activeNotCondLoading">
            <p>
              <Loader border={2} height={20} width={20}/>
            <span>
              {this.text}
            </span>
            </p>
          </div>
        </div>
      );
    }
  }
}

export default ActiveNotification;
