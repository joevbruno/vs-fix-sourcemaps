import React, { Component } from 'react';
import { connect } from 'react-redux';

class Main extends Component {
  render() {
    return (
      <div>
        <h1>About</h1>
      </div>
    );
  }
}

export default connect()(Main);
