import { combineReducers } from 'redux';
import userReducer from "./users";
import shareReducer from "./share";

export default combineReducers({
  users: userReducer,
  share: shareReducer
});
