import React from 'react';


export const submitFeedback = (feedbackForm) => {
    console.log(feedbackForm.state.inputs)
    // const currentComponent = this;
    // axios.get(PREFIX + '/getClasses/'+ this.state.email)
    //     .then(function (response) {
    //         // handle success
    //         console.log("response", response)
    //         const classes = response.data.instructor;
    //         const enrolled = [];
    //         const completed = [];
    //         console.log("\tclasses ", classes)
    //
    //         // Update state
    //         for (let i = 0; i < classes.length; i++) {
    //             if (classes[i].ongoing) {
    //                 enrolled.push({'courseName': classes[i].name})
    //             } else {
    //                 completed.push({'courseName': classes[i].name})
    //             }
    //         }
    //         console.log('completed ', completed)
    //         currentComponent.setState({'coursesTeaching': enrolled, 'coursesCompleted': completed});
    //         currentComponent.setState({'loading': false});
    //
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     })
}
