import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";

const ProfileFollowers = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchFollowers = async () => {
      try {
        const res = await Axios.get(`/profile/${username}/followers`, {
          cancelToken: ourRequest.token,
        });
        if (res.data) setFollowers(res.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    if (username) fetchFollowers();

    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {followers.map((follower, index) => (
        <Link
          key={index}
          to={`/profile/${follower.username}`}
          className="list-group-item list-group-item-action"
        >
          <img className="avatar-tiny" src={follower.avatar} />{" "}
          <span className="text-muted small">{follower.username} </span>
        </Link>
      ))}
    </div>
  );
};

export default ProfileFollowers;
