import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducer';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        promiseMiddleware
      ),
      process.env.NODE_ENV === 'development' && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept('./reducer.js', () => {
      const nextRootReducer = require('./reducer.js').default; // eslint-disable-line
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
