import axios from "axios";
import { deauthorise } from './auth';

/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

export const getClasses = () => {
  return new Promise((resolve, reject) => {
    axios.get(PREFIX + '/getClasses/'+ sessionStorage.email)
    .then((response) => {
      console.log(response)
      if (!response || !response.data || !response.data.instructor) reject("Bad")
      resolve(response.data.instructor);
    })
    .catch((error) => {
      if (error && error.response && error.response.status === 401) {
        deauthorise();
        setTimeout(() => window.location.reload(0), 1500);
      }
      reject(error);
    })
  })
}

export const getEnrollment = (classId) => {
  return new Promise((resolve, reject) => {
    axios.post(PREFIX + '/api/getclass',
    JSON.stringify({"_id": classId}),
    {headers: {"Content-Type": "application/json"}})
    .then((response) => {
      console.log(response);
      if (!response || !response.data || !response.data.result) reject("Bad'")
      resolve(response.data.result)
    })
    .catch((error) => {
      // handle error
      reject(error);
    })
  })
}

export const getClassReportByEmail = (classId, email) => {
  return new Promise((resolve, reject) => {
    axios.get(PREFIX + `/api/report/${classId}/${email}`)
    .then(response => {
      if (!response || !response.data || !response.data.report)
        reject({stat: 500, msg: "Something went wrong"});
      resolve(response.data.report);
    })
    .catch(err => {
      console.log(err);
    })
  })
}

export const submitFeedback = (email, classId, feedbackFormData) => {
  return new Promise((resolve, reject) => {

    const { marks, feedback, recommended } = feedbackFormData;
    const requestObj = {
      email,
      classId,
      mark: marks,
      comments: feedback,
      nextCourse: recommended
    }

    console.log("submitting report: ", requestObj)
    axios.post(PREFIX + '/api/updatereport',
    requestObj, {headers: {"Content-Type": "application/json"}})
    .then(response => {
      console.log(response);
      resolve()
    })
    .catch(error => {
      console.log(error);
      reject()
    })
  })
}

export const getClassMarkingScheme = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(PREFIX + `/api/class/${id}/marking`)
    .then(res => {
      if (!res || !res.data || !res.data.result) reject({stat: 500, msg: "Something went wrong"});
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
