import React from "react";
import "../styles/LoadingIndicator.css";

const LoadingIndicator = () => {
  return (
    <div className="three-body">
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
    </div>
  );
};

export default LoadingIndicator;
