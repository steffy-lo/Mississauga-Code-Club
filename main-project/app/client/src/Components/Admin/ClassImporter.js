import React from 'react';

import NavbarGeneric from '../Util/NavbarGeneric';
import StatusModal from '../Util/StatusModal';
import LoadingModal from '../Util/LoadingModal';

import { importFromFile } from '../../Actions/admin';
import "../CSS/Util/StatusModal.css";
import "../CSS/Common.css";

import "../CSS/Admin/Importer.css";

class ClassImporter extends React.Component {

  constructor(props) {
    super(props);
    this.file = React.createRef()
    this.state = {
      modalWindow: ""
    }
  }

  // componentDidMount() {
  //   this.setState({modalWindow:
  //   <CIModal
  //   onClose={() => this.setState({modalWindow: ""})}
  //   log={{
  //     Students: {'a2': ['erbgfdfds', 'df', 's', 'd', 's', 's', 'a', 's', 's', 's', 's', 's']},
  //     'Invalid File Formats': {'a2': []},
  //     Instructors: {'a2': []},
  //     Helpers: {'a2': []}
  //   }}
  //   />
  //   })
  // }

  render() {
    return(
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric/>
        <div className="flexContentContainerGeneric">
          <div className="flex horizontalCentre">
            <div id="importerFileWindow">
              <h1>Import A Class</h1>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  this.setState({modalWindow: <LoadingModal text="Attempting Import ..."/>})
                  importFromFile(this.file.current.files[0])
                  .then(errorLog => {
                    console.log(errorLog)
                    this.setState({
                      modalWindow:
                        <CIModal
                        onClose={() => this.setState({modalWindow: ""})}
                        log={errorLog}
                        />
                  })
                  })
                  .catch(err => {
                    this.setState({modalWindow: ""});
                    if (err.stat === 403) {
                      this.setState({
                        modalWindow:
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
                        modalWindow:
                          <StatusModal title="Import Failed"
                            text={err.msg}
                            onClose={() => this.setState({modalWindow: ""})}
                          />
                      })
                    }
                  })
                }}>
                  <p title=""><i>Please select a file</i></p>
                    <input
                      id="fileImportUpload"
                      type="file"
                      accept=".xlsx, .xls"
                      ref={this.file}
                    />
                  <button type="submit">
                    Begin Import
                  </button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

class CIModal extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      selectedItem: "",
      descView: "",
      selectionList: "",
      sheetList: <tr></tr>
    }
    this.close = props.onClose;
    // this.totalErrors = 0;
    this.baseData = props.log;
    this.eLogKeys = Object.keys(props.log.Students).concat(Object.keys(props.log['Invalid File Formats']));
  }

  componentDidMount() {
    this.singleTimeSetup();
  }

  singleTimeSetup() {
    let ticker = 0;
    const slList = [];
    const shList = [];
    console.log(this.eLogKeys)
    slList.push(
      <option key={ticker} value={null}>{"-- Pick a Sheet --"}</option>
    )
    for (let sheet of this.eLogKeys) {
      ticker++;
      slList.push(
        <option key={ticker} value={sheet}>{sheet}</option>
      );
      shList.push(
        <tr key={ticker}>
          <th>{sheet}</th>
          <td>{!this.baseData['Invalid File Formats'][sheet] ? 0 : 1}</td>
          <td>{(!this.baseData.Students[sheet] ? [] : this.baseData.Students[sheet]).length}</td>
          <td>{(!this.baseData.Instructors[sheet] ? [] : this.baseData.Instructors[sheet]).length}</td>
          <td>{(!this.baseData.Helpers[sheet] ? [] : this.baseData.Helpers[sheet]).length}</td>
        </tr>
      );
    }
    this.setState({
      selectionList: slList, sheetList: shList
    })
  }

  _genSimpleList(list) {
    if (!list) return [<p className='simpleListView'>No errors</p>];
    let ticker = 0;
    const compList = [];
    for (let item of list) {
      compList.push(
        <p className="simpleListView" key={ticker++}>{item}</p>
      )
    }
    if (compList.length < 1) {
      compList.push(
        <p className="simpleListView" key={ticker++}>No errors</p>
      )
    }
    return compList;
  }

  _populateDescription() {
    console.log(this.state.selectedItem)
    if (!this.eLogKeys.includes(this.state.selectedItem)) {
      return (<p>
        No valid item selected
        <br />
        <i>Please select a sheet</i>
      </p>);
    }
    const fileListing = this.baseData['Invalid File Formats'][this.state.selectedItem];
    const studentsListing = this.baseData.Students[this.state.selectedItem];
    const instructorsListing = this.baseData.Instructors[this.state.selectedItem];
    const volunteersListing = this.baseData.Helpers[this.state.selectedItem];

    return(
      <div id="descViewAdv">
        <h4>File Errors:</h4>
          <div className="scrollableMIDisplay">
            {this._genSimpleList(!fileListing ? [] : [fileListing])}
          </div>

        <h4>Student Import Errors:</h4>
          <div className="scrollableMIDisplay">
            {this._genSimpleList(studentsListing)}
          </div>

        <h4>Instructor Import Errors:</h4>
          <div className="scrollableMIDisplay">
            {this._genSimpleList(instructorsListing)}
          </div>

        <h4>Volunteer Import Errors:</h4>
          <div className="scrollableMIDisplay">
            {this._genSimpleList(volunteersListing)}
          </div>
      </div>
    )
  }

  render() {
    return(
      <div id="statusModalBlackout" className="fillContainer verticalCentre">
        <div id="importerLogModal" className="flex horizontalCentre">
          <div className="importerModalPane">
            <h2 title="A quick summary of any erros present">
              Summary
              </h2>
              {/*<h4>
                Total:
              </h4>
              <p>
                <b>{this.totalErrors}</b> errors in <b>{this.eLogKeys.length}</b> sheets
              </p>*/}
            <h4>Sheets:</h4>
            <div className="scrollableMIDisplay">
              <table id="scrollableMITable">
                <thead>
                  <tr>
                    <th style={{textAlign: 'left'}}>Sheet Name</th>
                    <th title="# of file errors">F</th>
                    <th title="# of student import errors">S</th>
                    <th title="# of instructor import errors">I</th>
                    <th title="# of volunteer import errors">V</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.sheetList}
                </tbody>
              </table>
            </div>
          </div>
          <div className="importerModalPane">
            <h2 title="A per sheet description of any errors that may have occured.">Details
              <span
                className="intCloseButton"
                onClick={this.close}
                >&times;</span></h2>
              <p title="Select a sheet">
              <select
              onChange={e => {
                this.setState({
                  selectedItem: e.target.value
                });
              }}>
                {this.state.selectionList}
              </select>
              </p>
              {this._populateDescription()}
          </div>
        </div>
      </div>
    )
  }
}


export default ClassImporter;
