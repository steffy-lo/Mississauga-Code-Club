import React from 'react';

import '../CSS/Loader.css';

class Loader extends React.Component {
  render() {

    return (
      <React.Fragment>
        <div style={{height: `100px`, width: `100px`, 'border-width': `10px`}}
        id='loaderContainer' />
      </React.Fragment>
    );
  }
}

export default Loader;
