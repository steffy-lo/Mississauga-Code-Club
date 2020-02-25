import React from "react";
import './styles.css';

class Grades extends React.Component {
    render() {
        const { entry } = this.props;
        return (
            <dl className="grade-list">
                <dt>
                    <label>{entry.name}</label>
                </dt>
                <dd>
                    {entry.grade}
                </dd>
            </dl>
          );
    }
}

export default Grades;