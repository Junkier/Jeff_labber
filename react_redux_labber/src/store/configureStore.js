import { createStore, applyMiddleware } from "redux";
import createLogger from "redux-logger";
import Immutable from "immutable";
import rootReducer from "../reducers";

const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const initState = Immutable.Map();

export default createStore(
    rootReducer,
    initState,
    // applyMiddleware(createLogger({ stateTransformer: state => state.toJS() }))
    applyMiddleware(logger)
);
