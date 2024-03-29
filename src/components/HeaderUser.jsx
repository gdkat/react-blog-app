import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { DispatchContext, StateContext } from "../context/Context";

const HeaderUser = ({ user, logout }) => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const signout = () => {
    logout();
  };

  const handleSearchIcon = (e) => {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  };

  const toggleChat = (e) => {
    appDispatch({ type: "toggleChat" });
  };

  console.log(appState);

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        href="#"
        onClick={handleSearchIcon}
        className="text-white mr-2 header-search-icon"
        data-for="search"
        data-tip="Search"
      >
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
      <span
        data-for="chat"
        data-tip="Chat"
        onClick={toggleChat}
        className={
          "mr-2 header-chat-icon " +
          (appState.unreadChatCount ? "text-danger" : "text-white")
        }
      >
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? (
          <span className={"chat-count-badge text-white"}>
            {appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}
          </span>
        ) : (
          ""
        )}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
      <Link
        data-for="profile"
        data-tip="My Profile"
        to={`/profile/${user.username}`}
        className="mr-2"
      >
        <img className="small-header-avatar" src={user.avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />{" "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{" "}
      <button onClick={signout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
};

export default HeaderUser;
