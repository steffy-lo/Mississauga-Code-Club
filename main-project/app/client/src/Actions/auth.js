import { setState } from "statezero";
import axios from "axios";

/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

/* Back-end interaction functions for authentication */

/*
  Log-in function

  Checks that the email and password provided are valid.
  Then, send a request to log in.

  If successfully logged in, sets the global user type &
  sends the appropriate redirect url (in a resolved promise)

  On failure, TENTATIVELY returns a rejected promise.
*/
export const authenticate = (email, password) => {
  return new Promise((resolve, reject) => {
    if (typeof email !== "string" || typeof password !== "string" ||
        email.length === 0 || password.length === 0) {
            reject("Input cannot be empty")
    }
    axios.post(PREFIX + "/authenticate",
    JSON.stringify({ email, password }),
    {headers: {"Content-Type": "application/json"}})
    .then(type => {
      if (!type || !type.data) throw {status: 500, statusText: "Something went wrong"};
      sessionStorage.setItem('uType', type.data.userType);
      setState('email', email);
      setState('prefix', PREFIX);
      resolve(['/a', '/t', '/v', '/s'][type.data.userType - 1]);
    })
    .catch(err => {
      reject(err);
    })
  })
}

export const deauthorise = () => sessionStorage.removeItem('uType');

export const isLocalAuthorised = () => {
  return ["1", "2", "3", "4"].includes(sessionStorage.getItem('uType'));
}

export const getAuth = () => {
  return sessionStorage.getItem('uType');
}

/*
  Logout functions

  Sends a logout request to the server.

  TENTATIVELY:
  On success, clears the global user type.

  On failure, outputs error to console.
*/
export const logout = () => {
  axios.get(PREFIX + "/logout")
  .then(res => {
    sessionStorage.removeItem('uType');
  })
  .catch(err => console.log(err));
}
