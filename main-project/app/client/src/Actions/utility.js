import axios from "axios";
import { deauthorise } from "./auth";

/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

/* Utility function for getting the name of the user type logged in */
export function getUserTypeExplicit() {
  let type = "";
  switch (sessionStorage.getItem("uType")) {
    case "1":
      type = "administrator";
      break;
    case "2":
      type = "teacher";
      break;
    case "3":
      type = "volunteer";
      break;
    case "4":
      type = "student";
      break;
    default:
      type = "error";

    //type = "student";
    //type = "administrator";
    //type = "teacher";
    //type = "volunteer";
  }
  return type;
}

/**
 * Function for getting an automatically generated report from the server,
 * based on provided filter options.
 *
 * IF fromDate is not included (i.e. empty string), then no minimum is present.
 * Likewise for toDate with respect to maximum.
 * If isPaid is null, then ALL hours are included in the report.
 * If email is null, then returns the report for the current user,
 * ohterwise for the specified user.
 * If email is not null, then the current user MUST be an admin.
 *
 * @param  {[String]}  fromDate     Minimum date for included hours entries.
 * @param  {[String]}  toDate       MAximum date for included hours entries.
 * @param  {Boolean} isPaid       Boolean corresponding to which kind of hours to consider.
 * @param  {[String]}  [email=null] Email of the user, whose report is desired, with these parameters,
 * @return {[Promise]}
 *  ON SUCCESS: Promise that resolves with the url of the report to download.
 *  ON FAILURE: PRomise that rejects with a status code and message (to display).
 *    ON 403: User is deauthorised & logged out.
 */
export const getHoursReport = (fromDate, toDate, isPaid, email = null) => {
  return new Promise((resolve, reject) => {
    const compileObj = {};
    if (isPaid !== null) compileObj.paid = isPaid ? 1 : 0;
    if (fromDate !== "")
      compileObj.startRange = new Date(fromDate + " 0:00:0").toISOString();
    if (toDate !== "")
      compileObj.endRange = new Date(toDate + " 23:59:59").toISOString();
    if (email !== null && email !== "") compileObj.email = email;
    axios
      .post(PREFIX + "/api/report/", JSON.stringify(compileObj), {
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        console.log(res);
        let url = window.URL.createObjectURL(new Blob([res.data]));
        resolve(url);
      })
      .catch(err => {
        if (err !== undefined && (err.status === 403 || err.status === 401)) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else {
          reject({
            stat: err.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Function foor getting the hours of some user.
 *
 * other is for admins only..
 * @param  {[String]} [other=null] Email of the target, if this target is not the current user,
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves with the hours informaton for the requsted user.
 * ON FAILURE: PRomise that rejects with a status code and message (to display).
 *    ON 403: User is deauthorised & logged out.
 */
export const getUserHours = (other = null) => {
  return new Promise((resolve, reject) => {
    const urlQuery = other === null ? "" : "?user=" + other;
    axios
      .get(PREFIX + "/api/hours/" + urlQuery)
      .then(res => {
        if (!res || !res.data || !res.data.hours)
          reject({ stat: 500, msg: "Something went wrong" });
        resolve(res.data.hours);
      })
      .catch(err => {
        if (err !== undefined && (err.status === 403 || err.status === 401)) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else {
          reject({
            stat: err.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/*
  Specific function for stripping the date from a JS Date object
  & returnign a String in the specific YYYY-MM-DD format.

  This only exists, because Chrome is especially picky about the format used by
  input JSX objects of type "date".
 */
export function genUniversalDate(date) {
  try {
    const y = date.getFullYear();
    let m = `${date.getMonth() + 1}`;
    if (m.length < 2) m = "0" + m;
    let d = `${date.getDate()}`;
    if (d.length < 2) d = "0" + d;
    return `${y}-${m}-${d}`;
  } catch (e) {
    return "";
  }
}
