import axios from "axios";
import { deauthorise } from './auth';

export const checkIn = (email, purpose, hours, paid) => {
  return new Promise((resolve, reject) => {
    if (email === "" || purpose === "" || hours === 0)
      reject({stat: 400, msg: "Your request was poorly formatted."});
    axios.post("/api/checkin",
    JSON.stringify({ email, purpose, hours, paid}),
    {headers: {"Content-Type": "application/json"}})
    .then(time => {
      if (!time || !time.data) throw {status: 500, statusText: "Something went wrong"};
      resolve(time.data.dateTime)
    })
    .catch(err => {
      if (err.status === 403 || err.status === 401) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else {
        reject({
          stat: err.status,
          msg: "There was an error processing your request. Please, try again later."
        });
      }
    })
  });
}
