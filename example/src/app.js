import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Routes from './routes';
import configureStore from './store/configureStore';
const store = configureStore();
window.peakState = () => store.getState();

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}


const rootElement = document.getElementById('app');
render(<App />, rootElement);
