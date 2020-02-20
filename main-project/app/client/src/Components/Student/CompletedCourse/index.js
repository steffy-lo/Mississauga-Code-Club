import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import StudentGrades from '../GradesView';

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
                    <Link to={{pathname: '/s/grades', state: {courseInfo: course}}}>
                        <Button>View Grades</Button>
                    </Link>
                </dt>
            </dl>
          );
    }
}

export default CompletedCourse;