import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import HeaderLogin from "./HeaderLogin";
import HeaderUser from "./HeaderUser";
import { StateContext, DispatchContext } from "../context/Context";

const Header = () => {
  const { user } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            {" "}
            ComplexApp{" "}
          </Link>
        </h4>
        {user ? (
          <HeaderUser user={user} logout={() => dispatch({ type: "logout" })} />
        ) : (
          <HeaderLogin
            login={(user) => dispatch({ type: "login", value: user })}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
