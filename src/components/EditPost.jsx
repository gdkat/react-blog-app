import React, { useContext, useEffect, useReducer, useState } from "react";
import Page from "./Page";
import NotFound from "./NotFound";
import { useParams, Link, withRouter } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { StateContext, DispatchContext } from "../context/Context";

const EditPost = (props) => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };

  const ourReducer = (state, action) => {
    const newState = { ...state };
    switch (action.type) {
      case "fetchComplete":
        newState.title.value = action.value.title;
        newState.body.value = action.value.body;
        newState.isFetching = false;
        return newState;
      case "titleChange":
        newState.title.hasErrors = false;
        newState.title.value = action.value;
        return newState;
      case "bodyChange":
        newState.body.hasErrors = false;
        newState.body.value = action.value;
        return newState;
      case "submitRequest":
        if (!state.title.hasErrors && !state.body.hasErrors) {
          newState.sendCount++;
        }
        return newState;
      case "saveRequestStarted":
        newState.isSaving = true;
        return newState;
      case "saveRequestFinished":
        newState.isSaving = false;
        return newState;
      case "titleRules":
        if (!action.value.trim()) {
          newState.title.hasErrors = true;
          newState.title.message = "You must provide a title.";
        }
        return newState;
      case "bodyRules":
        if (!action.value.trim()) {
          newState.body.hasErrors = true;
          newState.body.message = "You must provide a body.";
        }
        return newState;
      case "notFound":
        newState.notFound = true;
        newState.isFetching = false;
        return newState;
    }
  };

  const [state, dispatch] = useReducer(ourReducer, originalState);

  const onTitleChange = (e) => {
    dispatch({ type: "titleChange", value: e.target.value });
  };

  const onTitleBlur = (e) =>
    dispatch({ type: "titleRules", value: e.target.value });

  const onBodyChange = (e) => {
    dispatch({ type: "bodyChange", value: e.target.value });
  };

  const onBodyBlur = (e) =>
    dispatch({ type: "bodyRules", value: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  };

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        const res = await Axios.get(`/post/${state.id}`, {
          cancelToken: ourRequest.token,
        });
        if (res.data) {
          dispatch({ type: "fetchComplete", value: res.data });
          if (appState.user?.username != res.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "You do not have permission to edit that post",
            });
            props.history.push("/"); // redirect to homepage
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (state.id) fetchPost();

    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();

      const fetchPost = async () => {
        try {
          const res = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Post was updated." });
        } catch (e) {
          console.error(e);
        }
      };

      if (state.id) fetchPost();

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  if (state.notFound) return <NotFound />;

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to post permalink
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            value={state.title.value}
            placeholder=""
            autoComplete="off"
            onChange={onTitleChange}
            onBlur={onTitleBlur}
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onChange={onBodyChange}
            onBlur={onBodyBlur}
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving" : "Save New Post"}
        </button>
      </form>
    </Page>
  );
};

export default withRouter(EditPost);
