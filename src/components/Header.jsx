import React from "react";
import TSC from "../assets/tsc.png";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="navigation">
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/"><img src={TSC} alt="TSC Logo" /></Link>
          <Link to="/"><a href="/#">Home</a></Link>
          <Link to="/"><a href="/#articles-begin">Articles</a></Link>
          <Link to="/articles/create"><a href="/#">Write an Article</a></Link>
          <a href="/#">About</a>
        </div>
        <div className="nav-right">
          <a href="#">Sign in</a>
        </div>
      </div>
    </div>
  );
}