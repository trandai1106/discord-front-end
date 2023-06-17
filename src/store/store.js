import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import auth from "./reducers/authReducer";
import context from "./reducers/contextReducer";

const appReducers = combineReducers({
  auth,
  context,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  appReducers,
  composeEnhancers(applyMiddleware(thunk))
)

export default store;