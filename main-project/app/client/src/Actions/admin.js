import axios from "axios";
import { deauthorise } from './auth';

export const checkIn = (email, purpose, hours, paid) => {
  return new Promise((resolve, reject) => {
    if (email === "" || purpose === "" || hours === 0)
      reject({stat: 400, msg: "Your request was poorly formatted."});
    axios.post("/api/checkin",
    JSON.stringify({ email, purpose, hours, paid}),
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      if (!res || !res.data) throw {stat: 500, statusText: "Something went wrong"};
      resolve(res.data.dateTime)
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

export const createClass = (title) => {
  return new Promise((resolve, reject) => {
    if (title === "") reject({stat: 400, msg: "Classnames should not be empty"});
    axios.post("/api/newClass", JSON.stringify(title),
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      if (!res || !res.data) throw {stat: 500, statusText: "Something went wrong"};
      resolve(res.data.class_id);
    })
    .catch(err => {
      standardReject(err, reject);
    })
  });
}

export const createUser = (details) => {
  return new Promise((resolve, reject) => {
    if (details.firstName === "" || details.lastName === "" ||
    details.email === "" || details.telephone === "" ||
    (details.userType === 4 && (details.age <= 0 ||
      details.parentEmail === "")) || details.password === "" )  {
      reject({state: 400, msg: "Request was poorly formatted"});
    }
    const compiledReq = {
      email: details.email,
      password: details.password,
      userType: details.userType,
      firstName: details.firstName,
      lastName: details.lastName,
      telephone: details.telephone
    }
    if (details.userType === 4) {
      compiledReq['parentEmail'] = details.parentEmail;
      compiledReq['age'] = details.age;
    }
    axios.post("/api/createUser",
    JSON.stringify(compiledReq),
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      resolve();
    })
    .catch(err => {
      standardReject(err, reject);
    })
  });
}

const standardReject = (err, reject) => {
  if (err.status === 403 || err.status === 401) {
    deauthorise();
    reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
  } else {
    reject({
      stat: err.status,
      msg: "There was an error processing your request. Please, try again later."
    });
  }
}
