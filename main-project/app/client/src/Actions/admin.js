import axios from "axios";
import { deauthorise } from './auth';

/* For local debugging */
const DEBUG = 1;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

export const checkIn = (email, purpose, hours, paid) => {
  return new Promise((resolve, reject) => {
    if (email === "" || purpose === "" || hours === 0)
      return reject({stat: 400, msg: "Your request was poorly formatted."});
    axios.post(PREFIX + "/api/checkin",
    JSON.stringify({ email, purpose, hours, paid}),
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      if (!res || !res.data) throw {stat: 500, statusText: "Something went wrong"};
      resolve(res.data.dateTime)
    })
    .catch(err => {
      if (err.response.status === 403 || err.response.status === 401) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        });
      }
    })
  });
}

export const createClass = (courseTitle) => {
  return new Promise((resolve, reject) => {
    if (courseTitle === "") reject({stat: 400, msg: "Classnames should not be empty"});
    axios.post(PREFIX + "/api/admin/createcourse", JSON.stringify({ courseTitle }),
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      //if (!res || !res.data) throw {stat: 500, statusText: "Something went wrong"};
      resolve(res.data.id);
    })
    .catch(err => {
      standardReject(err.response, reject);
    })
  });
}

export const getClassList = () => {
  return new Promise((resolve, reject) => {
    axios.get(PREFIX + "/api/admin/getclasses", {headers: {"Content-Type": "application/json"}})
    .then(res => {
      if (!res || !res.data || !res.data.classList)
        throw {stat: 500, statusText: "Something went wrong"};
      resolve(res.data.classList);
    })
    .catch(err => standardReject(err.response, reject))
  });
}

export const getClass = (id) => {
  return new Promise((resolve, reject) => {
    axios.post(PREFIX + "/api/getclass",
    JSON.stringify({'_id': id}),
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      if (!res || !res.data || !res.data.result) throw {stat: 500, statusText: "Something went wrong"};
      resolve(res.data.result);
    })
    .catch(err => {
      if (err.response.status === 403 || err.response.status === 401) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 400) {
        reject({stat: 400, msg: "Missing class id."});
      } else if (err.response.status === 404) {
        reject({stat: 404, msg: `There was no class found with the given id.`});
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        })
      }
    })
  })
}

export const createUser = (details) => {
  return new Promise((resolve, reject) => {
    if (details.firstName === "" || details.lastName === "" ||
    details.email === "" || details.telephone === "" ||
    details.password === "" || (details.userType === 4
      && (details.parentEmail === "" || details.birthday === "" ||
      details.parentName === "")) ) {
      return reject({state: 400, msg: "Some information is missing. Please fill in all the blanks"});
    }
    console.log(details);
    const compiledReq = {
      email: details.email,
      password: details.password,
      userType: details.userType,
      firstName: details.firstName,
      lastName: details.lastName,
      phoneNumber: details.telephone,
      parentEmail: "noparent@email.com",
      parentName: "",
      birthday: "1970-01-01"
    }
    if (details.userType === 4) {
      compiledReq['parentEmail'] = details.parentEmail;
      compiledReq['birthday'] = details.birthday;
      compiledReq['parentName'] = details.parentName;
    }
    console.log(compiledReq);
    axios.post(PREFIX + "/api/admin/createuser",
    JSON.stringify(compiledReq),
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      resolve();
    })
    .catch(err => {
      standardReject(err.response, reject);
    })
  });
}

export const getUser = (email) => {
  return new Promise((resolve, reject) => {
    axios.post(PREFIX + "/api/admin/getuser",
    { email: email },
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      if (!res || !res.data) throw {stat: 500, statusText: "Something went wrong"};
      resolve(res.data.result);
    })
    .catch(err => {
      console.log(err);
      if (err.response.status === 403 || err.response.status === 401) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 400) {
        reject({stat: 400, msg: "Email was incorrectly formatted."});
      } else if (err.response.status === 404) {
        reject({stat: 404, msg: `There was no user found with the given email.`});
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        });
      }
    })
  });
}

export const getUserList = () => {
  return new Promise((resolve, reject) => {
    axios.get(PREFIX + "/api/admin/getusers",
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      console.log(res);
      if (!res || !res.data || !res.data.result)
        throw {stat: 500, statusText: "Something went wrong"};
      resolve(res.data.result);
    })
    .catch(err => {
      standardReject(err.response, reject);
    })
  })
}

export const editUser = (email, details) => {
  return new Promise((resolve, reject) => {
    if (details.firstName === "" || details.lastName === "" ||
    details.email === "" || details.telephone === "" ||
    (details.userType === 4 && (details.age <= 0 ||
      details.parentEmail === "")) || details.password === "" )  {
      return reject({state: 400, msg: "Request was poorly formatted"});
    }
    const compiledReq = {
      firstName: details.firstName,
      lastName: details.lastName,
      phoneNumber: details.telephone,
      birthday: details.birthday
    }
    if (details.userType === 4) {
      compiledReq['parentEmail'] = details.parentEmail;
    }
    axios.patch(PREFIX + "/api/admin/edituser",
    JSON.stringify({currentEmail: String(email) , newAttributes: compiledReq}),
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      resolve();
    })
    .catch(err => {
      if (err.response.status === 403 || err.response.status === 401) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 400) {
        reject({stat: 400, msg: "There was an error with the formatting"});
      } else if (err.response.status === 404) {
        reject({stat: 404, msg: `There was no user found with the given email.`});
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        });
      }
    })
  });
}

const standardReject = (err, reject) => {
  console.log(err);
  if (err !== undefined && (err.status === 403 || err.status === 401)) {
    deauthorise();
    reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
  } else {
    reject({
      stat: err.status,
      msg: "There was an error processing your request. Please, try again later."
    });
  }
}
