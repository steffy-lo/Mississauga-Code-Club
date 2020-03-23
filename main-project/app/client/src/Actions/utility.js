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

export const getCurrentUserHours = () => {
  return new Promise((resolve, reject) => {
    axios.get(PREFIX + "/api/hours/")
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
