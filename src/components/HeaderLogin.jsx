import React, { useEffect, useState } from "react";
import Axios from "axios";

const HeaderLogin = ({ login }) => {
  const [userInfo, setUserInfo] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.post("/login", userInfo);
      if (res.data) {
        login({
          token: res.data.token,
          username: res.data.username,
          avatar: res.data.avatar,
        });
      }
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const onChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            onChange={onChange}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            onChange={onChange}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};

export default HeaderLogin;
