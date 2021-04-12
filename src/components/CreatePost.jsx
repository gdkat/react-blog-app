import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import { DispatchContext } from "../context/Context";

const CreatePost = ({ history }) => {
  const [post, setPost] = useState({
    token: localStorage.getItem("userToken"),
  });
  const dispatch = useContext(DispatchContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.post("/create-post", post);
      if (res.data) {
        dispatch({ type: "flashMessage", value: "Successfully created post" });
        history.push(`/post/${res.data}`);
      }
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  };

  const onChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Page>
      <form onSubmit={handleSubmit}>
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
            placeholder=""
            autoComplete="off"
            onChange={onChange}
          />
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
            onChange={onChange}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
};

export default withRouter(CreatePost);
