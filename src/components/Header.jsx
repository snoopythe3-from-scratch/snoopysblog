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
          <Link to="/#articles"><a>Articles</a></Link>
          <Link to="/about"><a href="/#">About</a></Link>
        </div>
        <div className="nav-right">
          <Link to="/articles/create"><a href="/#">Write an Article</a></Link>
        </div>
      </div>
    </div>
  );
}