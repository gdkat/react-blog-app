import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import NotFound from "./NotFound";
import { useParams, useHistory, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import { StateContext, DispatchContext } from "../context/Context";

const ViewSinglePost = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { push } = useHistory();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        const res = await Axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        if (res.data) setPost(res.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    if (id) fetchPost();

    return () => {
      ourRequest.cancel();
    };
  }, [id]);

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  if (!isLoading && !post) return <NotFound />;

  const isOwner = () => {
    if (appState.user?.username == post.author.username) return true;

    return false;
  };

  const deleteHandler = async () => {
    const confirm = window.confirm("Do you really want to delete this post?");
    if (confirm) {
      console.log(appState.user?.token);
      try {
        const res = await Axios.delete(`/post/${id}`, {
          data: { token: appState.user?.token },
        });
        if (res.data == "Success") {
          appDispatch({
            type: "flashMessage",
            value: "Post Deleted Successfully",
          });
          push(`/profile/${appState.user?.username}`);
        }
      } catch (e) {
        console.error("Delete Error");
      }
    }
  };

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <Link
              to={`#`}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
              onClick={deleteHandler}
            >
              <i className="fas fa-trash"></i>
            </Link>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {post.createdDate}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  );
};

export default ViewSinglePost;
