import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from './Components/layout';
import About from './Containers/about';
import Main from './Containers/main';

export default class Routes extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Layout}>
          <IndexRoute component={Main} />
          <Route path="about" component={About} />
        </Route>
      </Router>
   );
  }
}
