import React, { useState, useReducer, useEffect } from "react";
import Page from "./Page";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";

const initialState = {
  username: {
    value: "",
    hasErrors: false,
    message: "",
    isUnique: false,
    checkCount: 0,
  },
  email: {
    value: "",
    hasErrors: false,
    message: "",
    isUnique: false,
    checkCount: 0,
  },
  password: {
    value: "",
    hasErrors: false,
    message: "",
  },
  submitCount: 0,
};

const ourReducer = (state, action) => {
  const newState = {
    errors: false,
    message: state.username.message,
  };
  switch (action.type) {
    case "usernameImmediately":
      if (action.value.length > 30) {
        newState.errors = true;
        newState.message = "Username cannot exceed 30 characters";
      }
      if (action.value && !/^([a-zA-z0-9]+)$/.test(action.value)) {
        newState.errors = true;
        newState.message = "Username can only contain letters and number.";
      }
      return {
        ...state,
        username: {
          value: action.value,
          hasErrors: newState.errors,
          message: newState.message,
        },
      };
    case "usernameAfterDelay":
      if (state.username.value.length < 3) {
        newState.errors = true;
        newState.message = "Username must be at least 3 characters.";
      }
      return {
        ...state,
        username: {
          value: action.value,
          hasErrors: newState.errors,
          message: newState.message,
        },
      };
    case "usernameUniqueResults":
      return { ...state };
    case "emailImmediately":
      return {
        ...state,
        email: {
          value: action.value,
          hasErrors: false,
        },
      };
    case "emailAfterDelay":
      return { ...state };
    case "emailUniqueResults":
      return { ...state };
    case "passwordImmediately":
      return {
        ...state,
        password: {
          value: action.value,
          hasErrors: false,
        },
      };
    case "passwordAfterDelay":
      return { ...state };
    case "submitForm":
      return { ...state };
    default:
      return state;
  }
};

const HomeGuest = () => {
  const [userInfo, setUserInfo] = useState({});
  const [state, dispatch] = useReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(
        () => dispatch({ type: "usernameAfterDelay" }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("/register", userInfo);
    } catch (e) {
      console.log(e.response.data);
    }
  };

  /* const onChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  }; */

  const usernameChange = (e) => {
    dispatch({ type: "usernameImmediately", value: e.target.value });
  };
  const emailChange = (e) => {
    dispatch({ type: "emailImmediately", value: e.target.value });
  };
  const passwordChange = (e) => {
    dispatch({ type: "passwordImmediately", value: e.target.value });
  };

  return (
    <Page title="Home" wide>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                onChange={usernameChange} // onChange={onChange}
              />
              <CSSTransition
                in={state.username.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                onChange={emailChange} // onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                onChange={passwordChange} // onChange={onChange}
              />
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default HomeGuest;
