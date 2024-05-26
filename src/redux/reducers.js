import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/authSlice";
import userReducer from "@/redux/usersSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
});
export default rootReducer;
