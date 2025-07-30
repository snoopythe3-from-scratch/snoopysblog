import React from "react";
import TSC from "./assets/tsc.png"

export default function Header() {
  return (
    <div className="navigation">
      <div className="nav-content">
        <div className="nav-left">
          <img src={TSC} alt="TSC Logo" />
          <a href="/#">Home</a>
          <a href="/#">Articles</a>
          <a href="/#">About</a>
        </div>
        <div className="nav-right">
          <a href="#">Sign in</a>
        </div>
      </div>
    </div>
  );
}