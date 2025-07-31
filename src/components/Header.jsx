import React from "react";
import TSC from "../assets/tsc.png";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="navigation">
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/"><img src={TSC} alt="TSC Logo" /></Link>
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