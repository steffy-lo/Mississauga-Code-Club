import { getState } from 'statezero';
import axios from "axios";
import { deauthorise } from './auth';

/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

export function getUserTypeExplicit() {
  let type = "";
  switch(sessionStorage.getItem('uType')) {
    case "1":
      type = "administrator";
      break
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

export const getHoursReport = (fromDate, toDate, isPaid, email=null) => {
  return new Promise((resolve, reject) => {
    const compileObj = {};
    if (isPaid !== null) compileObj.paid = isPaid ? 1 : 0;
    if (fromDate !== "") compileObj.startRange = new Date(fromDate + ' 0:00:0').toISOString();
    if (toDate !== "") compileObj.endRange = new Date(toDate + ' 23:59:59').toISOString();
    if (email !== null && email !== "") compileObj.email = email;
    axios.post(PREFIX + "/api/report/",
    JSON.stringify(compileObj),
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      console.log(res)
      let url = window.URL.createObjectURL(new Blob([res.data]));
      resolve(url)
    })
    .catch(err => {
      if (err !== undefined && (err.status === 403 || err.status === 401)) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else {
        reject({
          stat: err.status,
          msg: "There was an error processing your request. Please, try again later."
        });
      }
    })
  })
}

export const getUserHours = (other=null) => {
  return new Promise((resolve, reject) => {
    const urlQuery = other === null ? "" : "?user=" + other
    axios.get(PREFIX + "/api/hours/" + urlQuery)
    .then(res => {
      if (!res || !res.data || !res.data.hours) throw {stat: 500, statusText: "Something went wrong"};
      resolve(res.data.hours)
    })
    .catch(err => {
      if (err !== undefined && (err.status === 403 || err.status === 401)) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else {
        reject({
          stat: err.status,
          msg: "There was an error processing your request. Please, try again later."
        });
      }
    })
  })
}

export function genUniversalDate(date) {
  try {
    const y = date.getFullYear();
    let m = `${date.getMonth() + 1}`;
    if (m.length < 2) m = '0' + m;
    let d = `${date.getDate()}`;
    if (d.length < 2) d= '0' + d;
    return `${y}-${m}-${d}`;
  } catch (e) {
    return "";
  }
}
