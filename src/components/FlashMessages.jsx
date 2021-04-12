import React, { useEffect, useContext } from "react";
import { StateContext } from "../context/Context";

const FlashMessages = ({ msgs }) => {
  const { flashMessages } = useContext(StateContext);

  return (
    <div className="floating-alerts">
      {flashMessages.map((msg, index) => (
        <div
          key={index}
          className="alert alert-success text-center floating-alert shadow-sm"
        >
          {msg}
        </div>
      ))}
    </div>
  );
};

export default FlashMessages;
