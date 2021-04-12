import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

const ProfilePosts = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        const res = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: ourRequest.token,
        });
        if (res.data) setPosts(res.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    if (username) fetchPosts();

    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((post) => (
        <Post noAuthor={true} post={post} key={post._id} />
      ))}
    </div>
  );
};

export default ProfilePosts;
