import React from "react";

import NavbarGeneric from "../Util/NavbarGeneric";
import StatusModal from "../Util/StatusModal";
import LoadingModal from "../Util/LoadingModal";

import HelpButton from "../Util/HelpButton";

import { importFromFile } from "../../Actions/admin";
import "../CSS/Util/StatusModal.css";
import "../CSS/Common.css";

import "../CSS/Admin/Importer.css";

/**
 * View for importing classes from a spreadsheet file.
 * FUNCTIONALITY: Allow an admin to upload a validly formatted spreadsheet
 * which will be used to create classes and students, accordingly.
 * MULTIPLE SHEETS SUPPORTED & EACH SHEET ACTS AS A CLASS/COURSE.
 * (FORMAT EXPECTED: .XLSX OR .XLS)
 * See extra information provided on handover for more information about what
 * constitutes a valid sheet.
 * On successful return, displays a quick summary of the status of the report
 * INCLUDING errors importing students, teachers and volunteers
 *  AND sheet (file) format errors (FATAL).
 *
 * CONTEXT: ONLY to be used by admins.
 *
 * @extends React
 */
class ClassImporter extends React.Component {
  constructor(props) {
    super(props);
    //Necessary for sending files.
    this.file = React.createRef();
    //Most operations in this view are modalised.
    this.state = {
      modalWindow: ""
    };
  }

  render() {
    return (
      <React.Fragment>
        {this.state.modalWindow}
        <NavbarGeneric crumbs={[{tag: "Dashboard", link: "/a"}, {tag: "Import from File"}]}
	help={
                <HelpButton
                      text={
                        <div>
                          This page allows an admin to perform the initial import to create any new class.
                          <br />
                          Students that already exist should just have their email listed on the spreadsheet.

			  <br />
			  New students should have all their information filled in.

			  <br />
			  If an error occurs, the system will attempt to insert as much as possible. Rows that fail should be inserted manually through the edit class functions accessible on the main admin page.

			  <br />
			  Supported file types: .xls, .xlsx
                        </div>
			      }
                      parentForClose = {this}
                    />
		}
	/>
        <div className="flexContentContainerGeneric">
          <div className="flex horizontalCentre">
            {/* Upload Window */}
            <div id="importerFileWindow">
              <h1>Import A Class</h1>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  this.setState({
                    modalWindow: <LoadingModal text="Attempting Import ..." />
                  });
                  importFromFile(this.file.current.files[0])
                    .then(errorLog => {
                      console.log(errorLog);
                      this.setState({
                        modalWindow: (
                          <CIModal
                            onClose={() => this.setState({ modalWindow: "" })}
                            log={errorLog}
                          />
                        )
                      });
                    })
                    .catch(err => {
                      this.setState({ modalWindow: "" });
                      if (err.stat === 403) {
                        this.setState({
                          modalWindow: (
                            <LoadingModal
                              text={
                                <span>
                                  Your login has expired
                                  <br />
                                  Please reauthenticate
                                  <br />
                                  Singing you out ...
                                </span>
                              }
                            />
                          )
                        });
                        setTimeout(() => window.location.reload(0), 1000);
                      } else {
                        this.setState({
                          modalWindow: (
                            <StatusModal
                              title="Import Failed"
                              text={err.msg}
                              onClose={() => this.setState({ modalWindow: "" })}
                            />
                          )
                        });
                      }
                    });
                }}
              >
                <p title="">
                  <i>Please select a file</i>
                </p>
                <input
                  id="fileImportUpload"
                  type="file"
                  accept=".xlsx, .xls"
                  ref={this.file}
                />
                <button type="submit">Begin Import</button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

/**
 * Modal used to display the report for what was not successfully imported.
 * CONTEXT: USED BY ClassImporter to achieve the goal stated above.
 *
 * EXPECTS PROPS:
 *  onClose: FUNCTION | The function to be executed, when the close button is pressed.
 *    SHOULD: Remove this modal window from the main view it is attached to.
 *  log: ONJECT | The object returned by the server containing any errors for any
 *    sheet in the spreadsheet that occured.
 *    SEE ACTIONS:admin.js, importFromFile() for further details. *
 *
 * @extends React
 */
class CIModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "",
      descView: "",
      selectionList: "",
      sheetList: <tr></tr>
    };
    this.close = props.onClose;
    // this.totalErrors = 0;
    this.baseData = props.log;
    // Get the two disjoint lists of sheets, which together, comprise all sheets
    // of the spreadsheet.
    this.eLogKeys = Object.keys(props.log.Students).concat(
      Object.keys(props.log["Invalid File Formats"])
    );
  }

  componentDidMount() {
    this.singleTimeSetup();
  }

  /* Setup function */
  singleTimeSetup() {
    // Tickers are used to assign keys for react DOM objects lists for efficiency,
    // wherever a naturally provided alternative (e.x. id) does not exist.
    let ticker = 0;

    /*
      List used by select, allowing for the user to view the logs of each sheet
      in further detail.
     */
    const slList = [];
    // List of sheets (by name) & their number of errors.
    // Each entry is a table row (JSX).
    const shList = [];
    // Default selection option.
    slList.push(
      <option key={ticker} value={null}>
        {"-- Pick a Sheet --"}
      </option>
    );
    for (let sheet of this.eLogKeys) {
      ticker++;
      // Add the select option.
      slList.push(
        <option key={ticker} value={sheet}>
          {sheet}
        </option>
      );
      // Construct the table row for this sheet.
      const iffNum = !this.baseData["Invalid File Formats"][sheet] ? 0 : 1;
      const stuNum = (!this.baseData.Students[sheet]
        ? []
        : this.baseData.Students[sheet]
      ).length;
      const instNum = (!this.baseData.Instructors[sheet]
        ? []
        : this.baseData.Instructors[sheet]
      ).length;
      const volNum = (!this.baseData.Helpers[sheet]
        ? []
        : this.baseData.Helpers[sheet]
      ).length;

      /*
        Gives the counts a colour.
        RED IF FATAL ERROR (file format error).
        YELLOW IF NON-FATAL ERRORS (teacher/student/volunteer import error).
        GREEN IF NO ERRORS.
       */
      const errorCountColour = iffNum === 1 ? "fatal-errored" :
        stuNum + instNum + volNum === 0 ? "errorless" : "errored";

      shList.push(
        <tr
          className={errorCountColour}
          key={ticker}
        >
          <th>{sheet}</th>
          <td>{iffNum}</td>
          <td>{stuNum}</td>
          <td>{instNum}</td>
          <td>{volNum}</td>
        </tr>
      );
    }
    this.setState({
      selectionList: slList,
      sheetList: shList
    });
  }

  /**
   * HELPER METHOD.
   * Generates a simple list with the information given.
   * CONTEXT: Generates lists of errors for _populateDescription()
   *
   * @param  {[String]} list A [list:?] of errors to display.
   * @return {[<p:JSX>]}
   *  A list of <p> wrapped & styled errors.
   *  If no errors, then returns a list with a single entry declaring this.
   */
  _genSimpleList(list) {
    // If list is null, undefined or empty, return this.
    if (!list) return [<p className="simpleListView">No errors</p>];
    let ticker = 0;
    const compList = [];
    // General case.
    for (let item of list) {
      compList.push(
        <p className="simpleListView" key={ticker++}>
          {item}
        </p>
      );
    }
    //Completion check. Theoretically, this should never be executed.
    if (compList.length < 1) {
      compList.push(
        <p className="simpleListView" key={ticker++}>
          No errors
        </p>
      );
    }
    return compList;
  }

  /**
   * HELPER METHOD
   * Generates the right pane view for the two-part modal,
   * which contains a more detailed report for the errors of the sheet selected.
   *
   * @return {[<div:JSX>]} The populated list sections of the right pane of this modal.
   */
  _populateDescription() {
    // For invalid selections (& the default selection).
    if (!this.eLogKeys.includes(this.state.selectedItem)) {
      return (
        <p>
          No valid item selected
          <br />
          <i>Please select a sheet</i>
        </p>
      );
    }
    /*
      Gets information based on state variable "selectedITem", set through a select box.
     */
    const fileListing = this.baseData["Invalid File Formats"][
      this.state.selectedItem
    ];
    const studentsListing = this.baseData.Students[this.state.selectedItem];
    const instructorsListing = this.baseData.Instructors[
      this.state.selectedItem
    ];
    const volunteersListing = this.baseData.Helpers[this.state.selectedItem];

    /*
      For each of these, generates a report list. For more info, see previous function.
     */
    return (
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
    );
  }

  render() {
    return (
      <div id="statusModalBlackout" className="fillContainer verticalCentre">
        <div id="importerLogModal" className="flex horizontalCentre">
          {/*
            Left Pane
            FEATURES a list of sheets with their number of each type of error.
          */}
          <div className="importerModalPane">
            <h2 title="A quick summary of any erros present">Summary</h2>
            <h4>Sheets:</h4>
            <div className="scrollableMIDisplay">
              <table id="scrollableMITable">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Sheet Name</th>
                    <th title="# of file errors">F</th>
                    <th title="# of student import errors">S</th>
                    <th title="# of instructor import errors">I</th>
                    <th title="# of volunteer import errors">V</th>
                  </tr>
                </thead>
                <tbody>{this.state.sheetList}</tbody>
              </table>
            </div>
          </div>
          {/*
            Right Pane
          */}
          <div className="importerModalPane">
            <h2 title="A per sheet description of any errors that may have occured.">
              Details
              {/*
                Quite possibly the only traditional 'X' close button used.
                Executes the provided close function (via the onClose prop).
                 */}
              <span className="intCloseButton" onClick={this.close}>
                &times;
              </span>
            </h2>
            {/*
              As promised somewhere above, the select box that sets the selected item.
              This will repopulate each time a new item is selected.
              Uses the selectionList generated and assigned in singleTimeSetup.
            */}
            <p title="Select a sheet">
              <select
                onChange={e => {
                  this.setState({
                    selectedItem: e.target.value
                  });
                }}
              >
                {this.state.selectionList}
              </select>
            </p>
            {this._populateDescription()}
          </div>
        </div>
      </div>
    );
  }
}

export default ClassImporter;
