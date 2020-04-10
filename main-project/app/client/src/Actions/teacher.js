import axios from "axios";
import { deauthorise } from './auth';

/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

/**
 * Gets the classes that the the current user (admin and teacher only) teaches.
 * @return {[Promise]}
 * ON SUCCESS: Promise that resolves with the list of classes this user
 *  teaches.
 * ON FAILURE: Promise that rejects with a status code and message (to display).
 *    ON 403: User is deauthorised & logged out.
 */
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

/**
 * Gets the students of the class with the given id (and the class name).
 * @param  {[String]} classId The ID of the class in question.
 * @return {[Promise]}
 * ON SUCCESS: Promise that resolves with student list for this class and the name
 *  of this class.
 * ON FAILURE: PRomise that rejects with a status code and message (to display).
 *    ON 403: User is deauthorised & logged out.
 */
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

/**
 * Gets a given student's report for a specific given class.
 * @param  {[String]} classId The id of class in question.
 * @param  {[String]} email   The email of the student in question.
 * @return {[Promise]}
 * ON SUCCESS: Promise that resolves with the report information for the given
 *  student for the given class.
 * ON FAILURE: PRomise that rejects with a status code and message (to display).
 *    ON 403: User is deauthorised & logged out.
 */
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

/**
 * Sets the feedback (i.e. report) for a given student for a class with the given id.
 * @param  {[String]} email            The email of the student in question.
 * @param  {[String]} classId          The id of the class in question.
 * @param  {[{ marks:[int], comments:String, nextCourse:String }]} feedbackFormData
 *  The new report information for this student.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that successfully resolves.
 * ON FAILURE: PRomise that rejects with a status code and message (to display).
 *    ON 403: User is deauthorised & logged out.
 */
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
    JSON.stringify(requestObj), {headers: {"Content-Type": "application/json"}})
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

/**
 * Gets the marking information for the class with the given id.
 * @param  {[String]} id The id of the class, whose markign section is of interest.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves with an object containing the marking information
 *  for this class.
 *  ON FAILURE: You get the idea.
 */
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

/**
 * Sets ONE criterion in the marking scheme of this class.
 * No two marking sections may have the same name.
 * This WILL OVERWRITE marking sections of the same name.
 *
 * @param {[String]} classId      The id of class whose marking section is to be modified.
 * @param {[String]} sectionTitle The marking section in this class's marking sections to change.
 * @param {[int]} weight       The new weight of this marking section.
 * @param {[int]} index        The new index of this marking section (used for ordering).
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
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

/**
 * Removes the criterion with the given name from the marking section of the
 *  class with the given id.
 * @param  {[String]} classId      [description]
 * @param  {[String]} sectionTitle [description]
 * @return {[Promise]}              [description]
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
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
