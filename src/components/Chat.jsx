import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DispatchContext, StateContext } from "../context/Context";
import io from "socket.io-client";
const socket = io("http://localhost:8080");

const Chat = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const [state, setState] = useState({
    fieldValue: "",
    chatMessages: [],
  });

  const closeChat = (e) => {
    appDispatch({ type: "closeChat" });
  };

  const handleFieldChange = (e) => {
    setState({ ...state, fieldValue: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: appState.user.token,
    });

    /* const newState = { ...state };

    newState.chatMessages.push({
      message: state.fieldValue,
      username: appState.user.username,
      avatar: appState.user.avatar,
    });
    newState.fieldValue = "";

    setState(newState); */

    setState({
      ...state,
      chatMessages: [
        ...state.chatMessages,
        {
          message: state.fieldValue,
          username: appState.user.username,
          avatar: appState.user.avatar,
        },
      ],
      fieldValue: "",
    });
  };

  useEffect(() => {
    socket.on("chatFromServer", (message) => {
      setState((state) => ({
        ...state,
        chatMessages: [...state.chatMessages, message],
      }));
    });

    return () => socket.off("chatFromServer");
  }, []);

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.chatMessages.length && !appState.isChatOpen)
      appDispatch({ type: "incrementUnreadChatCount" });
  }, [state.chatMessages]);

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (appState.isChatOpen ? "chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={closeChat} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username === appState.user.username)
            return (
              <div key={message.message + index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          else
            return (
              <div key={message.message + index} className="chat-other">
                <Link to={`/profile/${message.username}`}>
                  <img className="avatar-tiny" src={message.avatar} />
                </Link>
                <div className="chat-message">
                  <div className="chat-message-inner">
                    <Link to={`/profile/${message.username}`}>
                      <strong>{message.username}: </strong>
                    </Link>
                    {message.message}
                  </div>
                </div>
              </div>
            );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          value={state.fieldValue}
          ref={chatField}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          onChange={handleFieldChange}
        />
      </form>
    </div>
  );
};

export default Chat;
