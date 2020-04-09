import React from 'react';

import "../CSS/Common.css";
import "../CSS/Util/StatusModal.css";
import { getUserTypeExplicit } from '../../Actions/utility.js';

import StatusModal from "../Util/StatusModal";

class HelpButton extends React.Component {

  constructor(props) {
    super(props);
    this.title = props.title === null || props.title === undefined ?
      "Help" : props.title;
    this.text = props.text === null || props.text === undefined ?
      "" : props.text;
    this.parentForClose = props.parentForClose === null || props.parentForClose === undefined ? () => true : props.parentForClose

    this.onClose = props.onClose === null || props.onClose === undefined ?
      () => true : props.onClose;
    this.colourScheme = props.colourScheme === null || props.colourScheme === undefined ?
      "defaultStatusButton" : props.colourScheme;
  }

  render() {
    return(
    <React.Fragment>
      <button
        onClick={() => {this.parentForClose.setState({modalWindow:
						      <StatusModal
                      text={this.text}
		      title="Help"
		      onClose={() => this.parentForClose.setState({modalWindow: ""})}/>})}}>
                      Help
                    </button>
    </React.Fragment>
    )
  }
}

export default HelpButton;
