import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import {applyMiddleware, compose} from 'redux'
import {thunk} from 'redux-thunk'
import { adminReducer } from "./reducers/adminReducer";
const superPayStore = configureStore(
  {
    reducer: {
      user: userReducer,
      admin: adminReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  },
  compose(applyMiddleware(thunk))
);

export default superPayStore
