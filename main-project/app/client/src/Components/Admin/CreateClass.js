import React from 'react';

import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";

class CreateClass extends React.Component {

  constructor(props) {
    super(props);
    this.onClose = props.onClose;
    this.state = {
      toDisplay: null,
      nameOfClass: ""
    }
  }

  render() {
    if (this.state.toDisplay === null) {
      return (
        <div id="statusModalBlackout" className="fillContainer flex verticalCentre">
          <div id="statusModalSubBlackout" className="flex horizontalCentre">
          <div id="statusModalWindow">
            <h1>Create A Class</h1>
            <span>Class Name:&nbsp;
              <input type="text"
              value={this.state.nameOfClass}
              onChange={e => {
                this.setState({nameOfClass: e.target.value});
              }}
              />
            </span>
            <div className="buttonSectionWrapper">
              <button className="adminStyle"
              onClick={e => {
                this.onClose();
              }}>
                OK
              </button>
              <button className="adminStyle"
              onClick={e => this.onClose()}>
                Close
              </button>
            </div>
          </div>
          </div>
        </div>
      );
    } else {
      return this.state.toDisplay;
    }
  }
}

export default CreateClass;
