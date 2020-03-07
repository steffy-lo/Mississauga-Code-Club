import React from 'react';

import '../CSS/Loader.css';

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.border = `${props.border === undefined ? 10 : props.border}px`;
    this.height = `${props.height === undefined ? 100 : props.height}px`;
    this.width = `${props.width === undefined ? 100 : props.width}px`;
  }

  render() {
    const styling={height: this.height, width: this.width,
      borderWidth: this.border};
    return (
        <div style={styling}
        id='loaderContainer'>
        </div>
    );
  }
}

export default Loader;
