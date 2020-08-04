import React from "react";

const Loading = () => {
  return (
    <div
      className="load col-12 offset-md-4"
      style={{ animationDuration: "3s" }}
    >
      <span
        className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"
        style={{ marginLeft: "14%" }}
      ></span>
      <h2 className="symbol">Loading . . . .</h2>
    </div>
  );
};

export default Loading;
