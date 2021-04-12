import React, { useEffect, useContext, useState } from "react";
import Page from "./Page";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
import Axios from "axios";
import { StateContext } from "../context/Context";
import ProfilePosts from "./ProfilePosts";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";

const Profile = () => {
  const { username } = useParams();
  const { user } = useContext(StateContext);
  const [state, setState] = useState({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const res = await Axios.post(
          `/profile/${username}`,
          {
            token: user.token,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        if (res.data) setState({ ...state, profileData: res.data });
      } catch (e) {
        console.log(e);
      }
    };

    if (user) fetchData();

    return () => {
      ourRequest.cancel();
    };
  }, [user, username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState({ ...state, followActionLoading: true });

      const ourRequest = Axios.CancelToken.source();

      const fetchData = async () => {
        try {
          const res = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          if (res.data == true)
            setState({
              ...state,
              followActionLoading: false,
              profileData: {
                ...state.profileData,
                isFollowing: true,
                counts: {
                  ...state.profileData.counts,
                  followerCount: state.profileData.counts.followerCount + 1,
                },
              },
            });
        } catch (e) {
          console.log(e);
        }
      };

      if (user) fetchData();

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState({ ...state, followActionLoading: true });

      const ourRequest = Axios.CancelToken.source();

      const fetchData = async () => {
        try {
          const res = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          if (res.data == true)
            setState({
              ...state,
              followActionLoading: false,
              profileData: {
                ...state.profileData,
                isFollowing: false,
                counts: {
                  ...state.profileData.counts,
                  followerCount: state.profileData.counts.followerCount - 1,
                },
              },
            });
        } catch (e) {
          console.log(e);
        }
      };

      if (user) fetchData();

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  const startFollowing = () => {
    setState({
      ...state,
      startFollowingRequestCount: state.startFollowingRequestCount + 1,
    });
  };

  const stopFollowing = () => {
    setState({
      ...state,
      stopFollowingRequestCount: state.stopFollowingRequestCount + 1,
    });
  };

  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />{" "}
        {state.profileData.profileUsername}
        {user != null &&
          !state.profileData.isFollowing &&
          user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== "..." && (
            <button
              onClick={startFollowing}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {user != null &&
          state.profileData.isFollowing &&
          user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== "..." && (
            <button
              onClick={stopFollowing}
              disabled={state.followActionLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              Stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink
          exact
          to={`/profile/${state.profileData.profileUsername}`}
          className="nav-item nav-link"
        >
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/followers`}
          className="nav-item nav-link"
        >
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/following`}
          className="nav-item nav-link"
        >
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Switch>
        <Route exact path={"/profile/:username"}>
          <ProfilePosts />
        </Route>
        <Route path={"/profile/:username/followers"}>
          <ProfileFollowers />
        </Route>
        <Route path={"/profile/:username/following"}>
          <ProfileFollowing />
        </Route>
      </Switch>
    </Page>
  );
};

export default Profile;
