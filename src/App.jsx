import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";

import { StateContext, DispatchContext } from "./context/Context";

import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";
import Chat from "./components/Chat";

Axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
  const appState = {
    user: localStorage.getItem("userToken")
      ? {
          token: localStorage.getItem("userToken"),
          username: localStorage.getItem("userName"),
          avatar: localStorage.getItem("userAvatar"),
        }
      : null,
    flashMessages: [],
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  const appReducer = (state, action) => {
    switch (action.type) {
      case "login":
        return { ...state, user: action.value };
      case "logout":
        return { ...state, user: null };
      case "flashMessage":
        return {
          ...state,
          flashMessages: state.flashMessages.concat(action.value),
        };
      case "openSearch":
        return { ...state, isSearchOpen: true };
      case "closeSearch":
        return { ...state, isSearchOpen: false };
      case "toggleChat":
        return { ...state, isChatOpen: !state.isChatOpen };
      case "closeChat":
        return { ...state, isChatOpen: false };
      case "incrementUnreadChatCount":
        return { ...state, unreadChatCount: state.unreadChatCount + 1 };
      case "clearUnreadChatCount":
        return { ...state, unreadChatCount: 0 };
    }
  };

  const [state, dispatch] = useReducer(appReducer, appState);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("userToken", state.user.token);
      localStorage.setItem("userName", state.user.username);
      localStorage.setItem("userAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userAvatar");
    }
  }, [state.user]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.user ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/about-us" exact>
              <About />
            </Route>
            <Route path="/terms" exact>
              <Terms />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames={"search-overlay"}
            unmountOnExit
          >
            <Search />
          </CSSTransition>
          <Chat />
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));

//async component loading (no browser refresh)
if (module.hot) module.hot.accept();

//admin - rzvRG84caO5ZN7u0 - React-Course
//mongodb+srv://admin:rzvRG84caO5ZN7u0@cluster0.q1t4d.mongodb.net/React-Course?retryWrites=true&w=majority
