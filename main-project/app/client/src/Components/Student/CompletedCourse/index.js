import React from "react";

class CompletedCourse extends React.Component {
    render() {
        const { course } = this.props;
        return (
            <dl className="completed-courses">
                <dt>
                    <label>{course.courseName}</label>
                </dt>
                <dd>
                    {course.courseDesc}
                </dd>
                <dt>
                    <button>View Grades</button>
              </dt>
            </dl>
          );
    }
}

export default CompletedCourse;