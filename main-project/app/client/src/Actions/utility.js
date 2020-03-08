import { getState } from 'statezero';
import axios from "axios";

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

export function getUserHours() {
  return new Promise((resolve, reject) => {
    axios.get()
    .then()
    .then()
    .catch(e => {
      if (e.status === 403 || e.status === 401) {
        sessionStorage.removeItem('uType');
      } else reject("Could not process your request. Please, try again later.");
    })
  });
}
