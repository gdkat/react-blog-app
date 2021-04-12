import React, { useEffect } from "react";

const Container = ({ wide, children }) => {
  return (
    <div className={`container ${!wide && "container--narrow"} py-md-5`}>
      {children}
    </div>
  );
};

export default Container;
