import axios from "axios";
import { deauthorise } from "./auth";

/* For local debugging */
const DEBUG = 0;

/* Debug variables.*/
const PREFIX = DEBUG ? "http://localhost:80" : "";

/*
  "Standard ERROR reject response means:
  A Promise that rejects with an object, with an error code "stat" & a message "msg".
 */

/**
 * Checks in the user with the given email using the provided details (at this moment).
 * @param  {[String]} email    The email of the user in question.
 * @param  {[String]} purpose  The reason for this hours record (e.x. a course title: "Intro to Python").
 * @param  {[Float]} hours    The number of hours for this entry.
 * @param  {[Boolean]} paid     Whether or not this is vounteer work or (paid) teaching work.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves with the ISO-String datetime
 *  corresponding to when this check-in was successfully processed.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const checkIn = (email, purpose, hours, paid) => {
  return new Promise((resolve, reject) => {
    if (email === "" || purpose === "" || hours === 0)
      return reject({ stat: 400, msg: "Your request was poorly formatted." });
    axios
      .post(
        PREFIX + "/api/loghours",
        JSON.stringify({ email, purpose, hours, paid }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(res => {
        if (!res || !res.data)
          reject({ stat: 500, msg: "Something went wrong" });
        resolve(res.data.dateTime);
      })
      .catch(err => {
        if (err.response.status === 403 || err.response.status === 401) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Deletes the hours entry with the given id.
 * @param  {[String]} id The id of the hours entry to be deleted.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const deleteHoursEntry = id => {
  return new Promise((resolve, reject) => {
    axios
      .post(PREFIX + "/api/admin/deletehour", JSON.stringify({ id }), {
        headers: { "Content-Type": "application/json" }
      })
      .then(res => resolve())
      .catch(err => {
        if (err.response.status === 403) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 400) {
          reject({ stat: 400, msg: "Request missing ID of hours entry." });
        } else if (err.response.status === 409) {
          reject({
            stat: 400,
            msg:
              "Either ID is invalid or does not correspond to a currently existing hours record"
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Generates a new hours record for the user with the given email.
 * For use in creating a new hours entry in the EditHours view.
 *
 * @param  {[String]} email    The email of the user in question.
 * @param  {[String]} purpose  The reason for this hours record (e.x. a course code, such as PY234).
 * @param  {[Float]} hours    The number of hours for this entry.
 * @param  {[Boolean]} paid     Whether or not this is vounteer work or (paid) teaching work.
 * @param  {[String]} dateTime (ISO format, like for all dates) The datetime that this entry will have been submitted.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const genHours = (email, purpose, hours, paid, dateTime) => {
  return new Promise((resolve, reject) => {
    if (purpose === "" || hours === "" || dateTime === "")
      return reject({
        stat: 400,
        msg: "Request was poorly formatted. No attributes can be empty"
      });
    const compileObj = { purpose, hours, paid, dateTime };
    if (email !== null) compileObj.email = email;
    axios
      .post(PREFIX + "/api/admin/genhours", JSON.stringify(compileObj), {
        headers: { "Content-Type": "application/json" }
      })
      .then(res => resolve())
      .catch(err => {
        if (err.response.status === 403 || err.response.status === 401) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 400) {
          reject({
            stat: 400,
            msg: "Information is missing and/or email/hours is misformatted"
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Creates a new class with the given name.
 * @param  {[String]} courseTitle The name of the new class to be created.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves with the id of the newly created class.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const createClass = courseTitle => {
  return new Promise((resolve, reject) => {
    if (courseTitle === "")
      reject({ stat: 400, msg: "Classnames should not be empty" });
    axios
      .post(
        PREFIX + "/api/admin/createcourse",
        JSON.stringify({ courseTitle }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(res => {
        if (!res || !res.data)
          reject({ stat: 500, msg: "Something went wrong" });
        resolve(res.data.id);
      })
      .catch(err => {
        standardReject(err.response, reject);
      });
  });
};

/**
 * Gets a list of all classes.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves with a list of all classes (class id & name).
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const getClassList = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(PREFIX + "/api/admin/getclasses", {
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        console.log(res);
        if (!res || !res.data || !res.data.classList)
          reject({ stat: 500, msg: "Something went wrong" });
        resolve(res.data.classList);
      })
      .catch(err => standardReject(err.response, reject));
  });
};

/**
 * Gets the class information of the class with the given id.
 * @param  {[String]} id The id of the class inquestion
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves with the information of the class in queston.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const getClass = id => {
  return new Promise((resolve, reject) => {
    axios
      .post(PREFIX + "/api/getclass", JSON.stringify({ _id: id }), {
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        if (!res || !res.data || !res.data.result)
          reject({ stat: 500, msg: "Something went wrong" });
        resolve(res.data.result);
      })
      .catch(err => {
        if (err.response.status === 403 || err.response.status === 401) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 400) {
          reject({ stat: 400, msg: "Missing class id." });
        } else if (err.response.status === 404) {
          reject({
            stat: 404,
            msg: `There was no class found with the given id.`
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Adds the student with the given email to the class with the given id.
 * @param {[String]} email   The email of the student to be added to this class.
 * @param {[String]} classId The id of the class to which this student should be added.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const addStudent = (email, classId) => {
  return new Promise((resolve, reject) => {
    if (classId === "" || email === "")
      return reject({ status: 500, msg: "Missing class id or email" });
    axios
      .post(
        PREFIX + "/api/admin/addstudent",
        JSON.stringify({ email, classId }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(res => resolve())
      .catch(err => {
        if (err.response.status === 403) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 404) {
          reject({ stat: 404, msg: "Class or student does not exist." });
        } else if (err.response.status === 400) {
          reject({
            stat: 401,
            msg: `No student exists with the given email address`
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Adds the teacher with the given email to the class with the given id.
 * @param {[String]} email   The email of the teacher to be added to this class.
 * @param {[String]} classId The id of the class to which this teacher should be added.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const addTeacher = (email, classId) => {
  return new Promise((resolve, reject) => {
    if (classId === "" || email === "")
      return reject({ status: 500, msg: "Missing class id or email" });
    axios
      .post(
        PREFIX + "/api/admin/addinstructor",
        JSON.stringify({ email, classId }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(res => resolve())
      .catch(err => {
        if (err.response.status === 403) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 404) {
          reject({ stat: 404, msg: "Class or teacher does not exist." });
        } else if (err.response.status === 400) {
          reject({
            stat: 401,
            msg: `No teacher exists with the given email address`
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Adds the volunteer with the given email to the class with the given id.
 * @param {[String]} email   The email of the volunteer to be added to this class.
 * @param {[String]} classId The id of the class to which this volunteer should be added.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const addVolunteer = (email, classId) => {
  return new Promise((resolve, reject) => {
    console.log(email);
    console.log(classId);
    if (classId === "" || email === "")
      return reject({ status: 500, msg: "Missing class id or email" });
    axios
      .post(
        PREFIX + "/api/admin/addvolunteer",
        JSON.stringify({ email, classId }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(res => resolve())
      .catch(err => {
        if (err.response.status === 403) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 404) {
          reject({ stat: 404, msg: "Class or volunteer does not exist." });
        } else if (err.response.status === 400) {
          reject({
            stat: 401,
            msg: `No volunteer exists with the given email address`
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Removes the user with the user with the given email from the class with the given id,
 * soecifying the type of user that is being removed.
 * @param  {[String]} email   The email of the user to be removed.
 * @param  {[String]} classId The id of the class from which this user is to be removed.
 * @param  {[String]} type    The type of user to be removed.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const removeUserFromClass = (email, classId, type) => {
  return new Promise((resolve, reject) => {
    console.log(email);
    console.log(classId);
    if (classId === "" || email === "")
      return reject({ status: 500, msg: "Missing class id or email" });
    // In reality, the call below alternates between a theoretical 3
    // different calls (one for each possible type: instructor, student & volunteer)
    axios
      .post(
        PREFIX + "/api/admin/remove" + type,
        JSON.stringify({ email, classId }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(res => resolve())
      .catch(err => {
        if (err.response.status === 403) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 404) {
          reject({ stat: 404, msg: `Class or ${type} does not exist.` });
        } else if (err.response.status === 400) {
          reject({
            stat: 401,
            msg: `No ${type} exists with the given email address`
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Change the activity state and/or title of the class with the given class id.
 * @param  {[String]} classId  The id of the class to modify.
 * @param  {[Boolean]} status   The new activity status of this class.
 * @param  {[String]} newTitle The new title/name of this class.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const updateCourseInfo = (classId, status, newTitle) => {
  return new Promise((resolve, reject) => {
    if (classId === "" || newTitle === "")
      return reject({ status: 500, msg: "Missing class id or title" });
    axios
      .post(
        PREFIX + "/api/admin/updatecourseinfo",
        JSON.stringify({ classId, status, newTitle }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(res => resolve())
      .catch(err => {
        if (err.response.status === 403) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 400) {
          reject({
            stat: 400,
            msg: "Missing class sid &/or missing/invalid email."
          });
        } else if (err.response.status === 401) {
          reject({ stat: 401, msg: `Unsufficient access.` });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Creates a new user with the given details.
 * @param  {[Object]} details The information required for the creation of a new user. The format is just below.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const createUser = details => {
  return new Promise((resolve, reject) => {
    if (
      details.firstName === "" ||
      details.lastName === "" ||
      details.email === "" ||
      details.telephone === "" ||
      details.password === "" ||
      (details.userType === 4 &&
        (details.parentEmail === "" ||
          details.birthday === "" ||
          details.parentName === ""))
    ) {
      return reject({
        state: 400,
        msg: "Some information is missing. Please fill in all the blanks"
      });
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
    };
    if (details.userType === 4) {
      compiledReq["parentEmail"] = details.parentEmail;
      compiledReq["birthday"] = details.birthday;
      compiledReq["parentName"] = details.parentName;
    }
    console.log(compiledReq);
    axios
      .post(PREFIX + "/api/admin/createuser", JSON.stringify(compiledReq), {
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        resolve();
      })
      .catch(err => {
        standardReject(err.response, reject);
      });
  });
};

/**
 * Gets the details user with the given email.
 * @param  {[String]} email The email of the user in question.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves with the requested user's data.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const getUser = email => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        PREFIX + "/api/admin/getuser",
        { email: email },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(res => {
        if (!res || !res.data)
          reject({ stat: 500, msg: "Something went wrong" });
        resolve(res.data.result);
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 403 || err.response.status === 401) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 400) {
          reject({ stat: 400, msg: "Email was incorrectly formatted." });
        } else if (err.response.status === 404) {
          reject({
            stat: 404,
            msg: `There was no user found with the given email.`
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Gets the list of all users. STRICTLY admin only.
 *
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves withthe list of users.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const getUserList = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(PREFIX + "/api/admin/getusers", {
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        console.log(res);
        if (!res || !res.data || !res.data.result)
          reject({ stat: 500, msg: "Something went wrong" });
        resolve(res.data.result);
      })
      .catch(err => {
        standardReject(err.response, reject);
      });
  });
};

/**
 * Set the information for the user with the given email to that of 'details'.
 * @param  {[String]} email   The email of the user to modify.
 * @param  {[Object]} details The information to be changed for this user's data. Format below.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const editUser = (email, details) => {
  return new Promise((resolve, reject) => {
    if (
      details.firstName === "" ||
      details.lastName === "" ||
      details.email === "" ||
      details.telephone === "" ||
      (details.userType === 4 &&
        (details.birthday === "" || details.parentEmail === "")) ||
      details.password === ""
    ) {
      return reject({ state: 400, msg: "Request was poorly formatted" });
    }
    const compiledReq = {
      firstName: details.firstName,
      lastName: details.lastName,
      phoneNumber: details.telephone,
      birthday: new Date(details.birthday + " 0:0").toISOString()
    };
    if (details.userType === 4) {
      compiledReq["parentEmail"] = details.parentEmail;
      compiledReq["parentName"] = details.parentName;
    }
    axios
      .patch(
        PREFIX + "/api/admin/edituser",
        JSON.stringify({
          currentEmail: String(email),
          newAttributes: compiledReq
        }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(res => {
        resolve();
      })
      .catch(err => {
        if (err.response.status === 403 || err.response.status === 401) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 400) {
          reject({ stat: 400, msg: "There was an error with the formatting" });
        } else if (err.response.status === 404) {
          reject({
            stat: 404,
            msg: `There was no user found with the given email.`
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/**
 * Sets the information for the hours log with the given id to that of the given object.
 * @param  {[String]} currentId     ID of the hours record in question.
 * @param  {[Object]} newAttributes New information for this hours record. See the corresponding URI in main.py for format info.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves.
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const editHours = (currentId, newAttributes) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(
        PREFIX + "/api/admin/edithours",
        { currentId, newAttributes },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(res => resolve())
      .catch(err => {
        if (err.status === 493) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 400) {
          reject({
            stat: 400,
            msg:
              "Changes could not be applied due to " +
              "request missing data or containing illegal (id) changes"
          });
        } else {
          reject({
            stat: err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/* HELPER FUNCTION. Standard reject. Very commonly occurs. */
const standardReject = (err, reject) => {
  if (err !== undefined && (err.status === 403 || err.status === 401)) {
    deauthorise();
    reject({
      stat: 403,
      msg: "Your login has expired. Please, reauthenticate."
    });
  } else {
    reject({
      stat: !err ? 500 : err.status,
      msg:
        "There was an error processing your request. Please, try again later."
    });
  }
};

/**
 * Attempts to import students and classes from the given file.
 * @param  {[File]} file The file from which this information shall be had. SHOULD be an .XLSX OR .XLS file.
 * @return {[Promise]}
 * ON SUCCESS: A Promise that resolves with the error log for this import.
 *  (i.e. what went wrong, if anything)
 * ON FAILURE: Standard ERROR reject Promise.
 */
export const importFromFile = file => {
  return new Promise((resolve, reject) => {
    if (file === null) {
      //return reject({state: 400, msg: "Request was poorly formatted"});
      return reject({ stat: 500, msg: "No File Given" });
    }
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(PREFIX + "/testFile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(res => {
        if (!res || !res.data)
          return reject({ stat: 500, msg: "Something went wrong." });
        else if (
          !("Students",
          "Instructors",
          "Helpers",
          "Invalid File Formats" in res.data)
        )
          return reject({
            stat: 500,
            msg:
              "Received response was poorly formatted. Changes may still have gone through."
          });
        else resolve(res.data);
      })
      .catch(err => {
        if (
          err.response !== undefined &&
          (err.response.status === 403 || err.response.status === 401)
        ) {
          deauthorise();
          reject({
            stat: 403,
            msg: "Your login has expired. Please, reauthenticate."
          });
        } else if (err.response.status === 400) {
          reject({
            stat: 400,
            msg: "File was missing or was not of the correct format."
          });
        } else {
          reject({
            stat: !err ? 500 : err.response.status,
            msg:
              "There was an error processing your request. Please, try again later."
          });
        }
      });
  });
};

/* Test method for uploading files. Legacy code. */
export const uploadFileTest = file => {
  return new Promise((resolve, reject) => {
    if (file === null) {
      //return reject({state: 400, msg: "Request was poorly formatted"});
      console.log("Bad");
    }
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(PREFIX + "/testFile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(res => {
        if (!res || !res.data)
          return reject({ stat: 500, msg: "Something went wrong." });
        else resolve(res.data);
      })
      .catch(err => {
        standardReject(err, reject);
      });
  });
};
