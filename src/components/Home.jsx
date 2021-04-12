import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { StateContext } from "../context/Context";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { Link } from "react-router-dom";
import Post from "./Post";

const Home = () => {
  const { user } = useContext(StateContext);
  const [state, setState] = useState({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const res = await Axios.post(
          `/getHomeFeed`,
          {
            token: user.token,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        if (res.data) setState({ ...state, isLoading: false, feed: res.data });
      } catch (e) {
        console.log(e);
      }
    };

    if (user) fetchData();

    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (state.isLoading) return <LoadingDotsIcon />;

  return (
    <Page>
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">The Latest From Those You Follow</h2>
          <p className="list-group">
            {state.feed.map((post) => (
              <Post post={post} key={post._id} />
            ))}
          </p>
        </>
      )}
      {state.feed.length == 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
    </Page>
  );
};

export default Home;
