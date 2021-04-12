import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Post = ({ post, noAuthor, onClick }) => {
  return (
    <Link
      to={`/post/${post._id}`}
      onClick={onClick}
      className="list-group-item list-group-item-action"
    >
      <img className="avatar-tiny" src={post.author.avatar} />{" "}
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {!noAuthor && <>by {post.author.username}</>} on {post.createdDate}{" "}
      </span>
    </Link>
  );
};

export default Post;
