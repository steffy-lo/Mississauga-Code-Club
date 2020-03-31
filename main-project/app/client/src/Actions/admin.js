import axios from "axios";
import { deauthorise } from './auth';

/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

export const checkIn = (email, purpose, hours, paid) => {
  return new Promise((resolve, reject) => {
    if (email === "" || purpose === "" || hours === 0)
      return reject({stat: 400, msg: "Your request was poorly formatted."});
    axios.post(PREFIX + "/api/loghours",
    JSON.stringify({ email, purpose, hours, paid}),
    {headers: {"Content-Type": "application/json"}})
    .then(res => {
      if (!res || !res.data) throw {status: 500, statusText: "Something went wrong"};
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

export const deleteHoursEntry = (id) => {
  return new Promise((resolve, reject) => {
    axios.post(PREFIX + "/api/admin/deletehour",
    JSON.stringify({ id }),
    {headers: {"Content-Type": "application/json"}})
    .then(res => resolve())
    .catch(err => {
      if (err.response.status === 403) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 400) {
        reject({stat: 400, msg: "Request missing ID of hours entry."})
      } else if (err.response.status === 409) {
        reject({stat: 400, msg: "Either ID is invalid or does not correspond to a currently existing hours record"})
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        });
      }
    })
  });
}

export const genHours = (email, purpose, hours, paid, dateTime) => {
  return new Promise((resolve, reject) => {
    if (email === "" || purpose === "" || hours === "" || dateTime === "")
      return reject({stat: 400, msg: "Request was poorly formatted. No attributes can be empty"});
    axios.post(PREFIX + "/api/admin/genhours",
    JSON.stringify({ email, purpose, hours, paid, dateTime }),
    {headers: {"Content-Type": "application/json"}})
    .then(res => resolve())
    .catch(err => {
      if (err.response.status === 403 || err.response.status === 401) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 400) {
        reject({stat: 400, msg: "Information is missing and/or email/hours is misformatted"})
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
      if (!res || !res.data) throw {status: 500, statusText: "Something went wrong"};
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
      console.log(res)
      if (!res || !res.data || !res.data.classList)
        throw {status: 500, statusText: "Something went wrong"};
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
      if (!res || !res.data || !res.data.result) throw {status: 500, statusText: "Something went wrong"};
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

export const addStudent = (email, classId) => {
  return new Promise((resolve, reject) => {
    if (classId === "" || email === "")
      return reject({status: 500, msg: "Missing class id or email"});
    axios.post(PREFIX + "/api/admin/addstudent",
    JSON.stringify({ email, classId }),
    {headers: {"Content-Type": "application/json"}})
    .then(res => resolve())
    .catch(err => {
      if (err.response.status === 403) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 404) {
        reject({stat: 404, msg: "Class or student does not exist."});
      } else if (err.response.status === 400) {
        reject({stat: 401, msg: `No student exists with the given email address`});
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        })
      }
    })
  })
}

export const addTeacher = (email, classId) => {
  return new Promise((resolve, reject) => {
    if (classId === "" || email === "")
      return reject({status: 500, msg: "Missing class id or email"});
    axios.post(PREFIX + "/api/admin/addinstructor",
    JSON.stringify({ email, classId }),
    {headers: {"Content-Type": "application/json"}})
    .then(res => resolve())
    .catch(err => {
      if (err.response.status === 403) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 404) {
        reject({stat: 404, msg: "Class or teacher does not exist."});
      } else if (err.response.status === 400) {
        reject({stat: 401, msg: `No teacher exists with the given email address`});
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        })
      }
    })
  })
}

export const addVolunteer = (email, classId) => {
  return new Promise((resolve, reject) => {
    console.log(email);
    console.log(classId)
    if (classId === "" || email === "")
      return reject({status: 500, msg: "Missing class id or email"});
    axios.post(PREFIX + "/api/admin/addvolunteer",
    JSON.stringify({ email, classId }),
    {headers: {"Content-Type": "application/json"}})
    .then(res => resolve())
    .catch(err => {
      if (err.response.status === 403) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 404) {
        reject({stat: 404, msg: "Class or volunteer does not exist."});
      } else if (err.response.status === 400) {
        reject({stat: 401, msg: `No volunteer exists with the given email address`});
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        })
      }
    })
  })
}

export const removeUserFromClass = (email, classId, type) => {
  return new Promise((resolve, reject) => {
    console.log(email);
    console.log(classId)
    if (classId === "" || email === "")
      return reject({status: 500, msg: "Missing class id or email"});
    axios.post(PREFIX + "/api/admin/remove" + type,
    JSON.stringify({ email, classId }),
    {headers: {"Content-Type": "application/json"}})
    .then(res => resolve())
    .catch(err => {
      if (err.response.status === 403) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 404) {
        reject({stat: 404, msg: `Class or ${type} does not exist.`});
      } else if (err.response.status === 400) {
        reject({stat: 401, msg: `No ${type} exists with the given email address`});
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        })
      }
    })
  })
}

export const setCriterion = (classId, sectionTitle, weight, index) => {
  return new Promise((resolve, reject) => {
    if (classId === "" || sectionTitle === "" || weight < 1 || index < 1)
      return reject({status: 500, msg: "Missing or invalid class ID and/or criterion information"});
    axios.patch(PREFIX + "/api/setmarkingsection",
    JSON.stringify({ classId, sectionTitle, weightInfo: { weight, index }}),
    {headers: {"Content-Type": "application/json"}})
    .then(res => resolve())
    .catch(err => {
      if (err.response.status === 401) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 400) {
        reject({stat: 400, msg: `Missing or invalid class ID and/or criterion information.`});
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        })
      }
    })
  })
}

export const removeCriterion = (classId, sectionTitle) => {
  return new Promise((resolve, reject) => {
    if (classId === "" || sectionTitle === "")
      return reject({status: 500, msg: "Missing class id or criterion"});
    axios.patch(PREFIX + "/api/deletemarkingsection",
    JSON.stringify({ classId, sectionTitle }),
    {headers: {"Content-Type": "application/json"}})
    .then(res => resolve())
    .catch(err => {
      if (err.response.status === 401) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 400) {
        reject({stat: 400, msg: `Missing or invalid class ID and/or criterion.`});
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        })
      }
    })
  })
}

export const updateCourseInfo = ( classId, status, newTitle ) => {
  return new Promise((resolve, reject) => {
    if (classId === "" || newTitle === "")
      return reject({status: 500, msg: "Missing class id or title"});
    axios.post(PREFIX + "/api/admin/updatecourseinfo",
    JSON.stringify({ classId, status, newTitle }),
    {headers: {"Content-Type": "application/json"}})
    .then(res => resolve())
    .catch(err => {
      if (err.response.status === 403) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.response.status === 400) {
        reject({stat: 400, msg: "Missing class sid &/or missing/invalid email."});
      } else if (err.response.status === 401) {
        reject({stat: 401, msg: `Unsufficient access.`});
      } else {
        reject({
          stat: err.response.status,
          msg: "There was an error processing your request. Please, try again later."
        })
      }
    })
  });
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
      if (!res || !res.data) throw {status: 500, statusText: "Something went wrong"};
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
        throw {status: 500, statusText: "Something went wrong"};
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
    (details.userType === 4 && (details.birthday === "" ||
      details.parentEmail === "")) || details.password === "" )  {
      return reject({state: 400, msg: "Request was poorly formatted"});
    }
    const compiledReq = {
      firstName: details.firstName,
      lastName: details.lastName,
      phoneNumber: details.telephone,
      birthday: new Date(details.birthday +" 0:0").toISOString()
    }
    if (details.userType === 4) {
      compiledReq['parentEmail'] = details.parentEmail;
      compiledReq['parentName'] = details.parentName;
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

export const editHours = (currentId, newAttributes) => {
  return new Promise((resolve, reject) => {
    axios.patch(PREFIX + "/api/admin/edithours",
    { currentId, newAttributes },
    {headers: {"Content-Type": "application/json"}})
    .then(res => resolve())
    .catch(err => {
      if (err.status === 493) {
        deauthorise();
        reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
      } else if (err.statis === 400) {
        reject({stat: 400, msg: "Changes could not be applied due to " +
          "request missing data or containing illegal (id) changes"})
      } else {
        reject({
          stat: err.status,
          msg: "There was an error processing your request. Please, try again later."
        });
      }
    })
  })
}

const standardReject = (err, reject) => {
  if (err !== undefined && (err.status === 403 || err.status === 401)) {
    deauthorise();
    reject({stat: 403, msg: "Your login has expired. Please, reauthenticate."})
  } else {
    reject({
      stat: (!err) ? 500 : err.status,
      msg: "There was an error processing your request. Please, try again later."
    });
  }
}

export const uploadFileTest = (file) => {
  //return new Promise((resolve, reject) => {
    if (file === null) {
      //return reject({state: 400, msg: "Request was poorly formatted"});
      console.log("Bad");
    }
    const formData = new FormData();
    formData.append("file", file)
    axios.post(PREFIX + "/testFile",
    formData,
    {headers: {"Content-Type": "multipart/form-data"}})
    .then(res => {
      console.log(res);
      console.log(res.data);
    })
    .catch(err => {
      console.log(err)
    })
  //})
}
