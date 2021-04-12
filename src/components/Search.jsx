import Axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DispatchContext } from "../context/Context";
import Post from "./Post";

const Search = () => {
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useState({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  const handleSearchClose = () => {
    appDispatch({ type: "closeSearch" });
  };

  useEffect(() => {
    const searchKeyPressHandler = (e) => {
      if (e.keyCode == 27) {
        appDispatch({ type: "closeSearch" });
      }
    };

    document.addEventListener("keyup", searchKeyPressHandler);
    return () => document.removeEventListener("keyup", searchKeyPressHandler);
  }, []);

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState({
        ...state,
        show: "loading",
      });
      const delay = setTimeout(
        () => setState({ ...state, requestCount: state.requestCount + 1 }),
        500
      );

      return () => clearTimeout(delay);
    } else {
      setState({
        ...state,
        show: "neither",
      });
    }
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      const req = Axios.CancelToken.source();
      const fetchResults = async () => {
        try {
          const res = await Axios.post(
            "/search",
            { searchTerm: state.searchTerm },
            { cancelToken: req.token }
          );
          setState({ ...state, results: res.data, show: "results" });
        } catch (e) {
          console.error("There was a problem or the request was cancelled");
        }
      };
      fetchResults();
      return () => req.cancel();
    }
  }, [state.requestCount]);

  const handleInput = (e) => {
    const value = e.target.value;
    const newState = {
      ...state,
      searchTerm: value,
    };
    setState(newState);
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            onChange={handleInput}
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
          />
          <span onClick={handleSearchClose} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show == "loading" ? "circle-loader--visible" : "")
            }
          />
          <div
            className={
              "live-search-results " +
              (state.show == "results" ? "live-search-results--visible" : "")
            }
          >
            {!!state.results.length ? (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> (
                  {state.results.length > 1
                    ? `${state.results.length} items`
                    : `${state.results.length} item`}{" "}
                  found)
                </div>
                {state.results.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                    onClick={handleSearchClose}
                  />
                ))}
              </div>
            ) : (
              <p className="alert alert-danger text-center shadow-sm">
                Sorry, we could not find any results for that search.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
