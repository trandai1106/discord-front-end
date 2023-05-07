import { Actions, AxiosConfig } from "../configs";
import axios from "axios";
import { getToken } from "../services/auth";

// require("dotenv").config();

export function login(data) {
  // console.log(data);
  return async function loginThunk(dispatch, getState) {
    if (data.status == 1) {
      localStorage.setItem(
        `${process.env.REACT_APP_PREFIX_LOCAL}_access_token`,
        data.data.access_token
      );
      localStorage.setItem(
        `${process.env.REACT_APP_PREFIX_LOCAL}_refresh_token`,
        data.data.refresh_token
      );
      dispatch({
        type: Actions.LOGIN_SUCCESS,
        payload: {
          user: data.data.user_info,
          status: data.status,
          message: data.message,
        },
      });
    } else {
      dispatch({
        type: Actions.LOGIN_FAIL,
        payload: {
          status: 400,
          message: data.message,
        },
      });
    }
  };
}

export function logout() {
  return async function logoutThunk(dispatch, getState) {
    const axiosConfig = AxiosConfig();
    axiosConfig
      .post(`/auth-user/logout`)
      .then((res) => {
        localStorage.removeItem(`${process.env.REACT_APP_PREFIX_LOCAL}_user`);
        localStorage.removeItem(
          `${process.env.REACT_APP_PREFIX_LOCAL}_access_token`
        );
        localStorage.removeItem(
          `${process.env.REACT_APP_PREFIX_LOCAL}_refresh_token`
        );
        // window.location.reload();
        if (res.data.status === 1) {
          // window.location.href = "/login";
          dispatch({
            type: Actions.LOGOUT_SUCCESS,
            payload: {
              status: res.data.status,
              message: res.data.message,
            },
          });
        } else if (res.data.status === 0) {
          // window.location.href = "/login";
          dispatch({
            type: Actions.LOGOUT_FAIL,
            payload: {
              status: res.data.status,
              message: res.data.message,
            },
          });
        }
      })
      .catch((err) => {
        if (err.response) {
          localStorage.removeItem(`${process.env.REACT_APP_PREFIX_LOCAL}_user`);
          localStorage.removeItem(
            `${process.env.REACT_APP_PREFIX_LOCAL}_access_token`
          );
          localStorage.removeItem(
            `${process.env.REACT_APP_PREFIX_LOCAL}_refresh_token`
          );
          // window.location.href = "/login";
          dispatch({
            type: Actions.LOGOUT_FAIL,
          });
        }
      });
  };
}
