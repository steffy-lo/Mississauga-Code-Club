import React from 'react';

import StatusModal from '../Util/StatusModal';
import TwoOptionModal from '../Util/TwoOptionModal';
import LoadingModal from '../Util/LoadingModal';

import { createClass } from '../../Actions/admin';

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
                this.setState({toDisplay: <LoadingModal text="Creating class ..." />});
                createClass(this.state.nameOfClass)
                .then(class_id => {
                  this.setState({toDisplay: null});
                  this.setState({
                    toDisplay:
                      <StatusModal title="Class Creation Successful"
                        text={
                          <span>
                            {`Class ${this.state.nameOfClass}`}
                            <br />
                            {`with id: ${class_id}`}
                            <br />
                            created
                          </span>
                          }
                        textB="Edit"
                        onClose={() => this.setState({toDisplay: null})}
                      />
                  })
                })
                .catch(err => {
                  let clFunc = () => this.setState({toDisplay: null});
                  if (err.stat === 403) {
                    this.setState({toDisplay: null});
                    this.setState({
                      toDisplay:
                        <LoadingModal text={
                            <span>
                              Your login has expired
                              <br />
                              Please reauthenticate
                              <br />
                              Singing you out ...
                            </span>
                        }/>
                    })
                    setTimeout(() => window.location.reload(0), 1000);
                  } else {
                    this.setState({
                      toDisplay:
                        <StatusModal
                          title="Class Creation Failed"
                          text={err.msg}
                          onClose={clFunc}
                        />
                    })
                  }
                })
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
