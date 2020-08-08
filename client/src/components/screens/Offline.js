import React from "react";

const Nonet = () => {
  return (
    <div>
      <div className="offset-md-4 offset-2">
        <i class="large material-icons" style={{ fontSize: "1500%" }}>
          flight
        </i>
      </div>
      <div className="offset-md-3 offset-1">
        <i
          className="fa fa-exclamation-triangle fa-5x"
          style={{ color: "red" }}
        ></i>
        <span style={{ fontSize: "500%" }}>You are Offline</span>
      </div>
    </div>
  );
};

export default Nonet;
