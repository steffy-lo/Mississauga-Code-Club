import React from 'react';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { uploadFileTest } from '../../Actions/admin';

import "../CSS/Admin/CheckIn.css";

class BulkImport extends React.Component {

  constructor(props) {
    super(props);
    this.file = React.createRef()
    this.state = {
      modalWindow: ""
    }
  }

  _generateModal(title, text) {
    return (
      <StatusModal
        title={title}
        text={text}
        onClose={this.clearParams}
        colourScheme="adminStyle"/>
    )
  }

  render() {
    return(
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric/>
        <div className="absolute fillContainer flex verticalCentre">
          <div className="flex horizontalCentre">
            <div id="checkInMainWindow">
              <h1>Upload File</h1>

              <form

                onSubmit={e => {
                  e.preventDefault()
                  console.log("Uploading:")
                  console.log(this.file.current.files[0])
                  uploadFileTest(this.file.current.files[0])
                }}>
                <div><b>Email</b>:&nbsp;
                  <input type="file" ref={this.file} />
                </div>
                <button type="submit">
                  Confirm
                </button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default BulkImport;
