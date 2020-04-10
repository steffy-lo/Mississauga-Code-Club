import React from 'react';

import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { createClass } from '../../Actions/admin';

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";

/**
 * MODAL VIEW
 * FUNCTIONALITY: Create an empty class with a given name.
 * The created class will be empty &, by default, ongoing.
 * CONTEXT: Attached to a button in the admin dashboard/manage classes view.
 *
 * EXPECTS PROP:
 *  onClose: FUNCTION | Function to be executed on attempted close.
 *    SHOULD: Remove this modal from the view it is attached to.
 *
 * @extends React
 */
class CreateClass extends React.Component {

  constructor(props) {
    super(props);
    this.onClose = props.onClose;
    this.state = {
      // Used to display alternative views (Loaders and status).
      toDisplay: null,
      nameOfClass: ""
    }
  }

  render() {
    if (this.state.toDisplay === null) {
      return (
        <div id="statusModalBlackout" className="fillContainer flex verticalCentre">
          <div id="statusModalSubBlackout" className="flex horizontalCentre">
            {/* Class creation modal proper. Features the class name input */}
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
            {/* Buttons for the modal */}
            <div className="buttonSectionWrapper">
              <button className="adminStyle"
              onClick={e => {
                this.setState({toDisplay: <LoadingModal text="Creating class ..." />});
                createClass(this.state.nameOfClass)
                .then(class_id => {
                  // On success. Alert the user.
                  this.setState({toDisplay: null});
                  this.setState({
                    toDisplay:
                      <StatusModal title="Class Creation Successful"
                        text={
                          <span>
                            {`Class "${this.state.nameOfClass}"`}
                            <br />
                            was successfully created
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
                    // Clear the extra view, first.
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
                    // Non-authorisation based errors.
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
              <button
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
