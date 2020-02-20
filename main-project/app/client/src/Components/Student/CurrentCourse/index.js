import React from "react";

class CurrentCourse extends React.Component {
    render() {
        const { course } = this.props;
        return (
            <dl className="current-courses">
                <dt>
                    <label>{course.courseName}</label>
                </dt>
                <dd>
                    {course.courseDesc}
                </dd>
            </dl>
          );
    }
}

export default CurrentCourse;