import React, { PropTypes, Component } from 'react';

class Layout extends Component {
  render() {
    return (
      <div>
        <h1>From Layout</h1>
        {this.props.children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.any
};

export default Layout;
