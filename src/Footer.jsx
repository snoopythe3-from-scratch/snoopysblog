import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <strong>The Scratch Channel</strong> is not affiliated with Scratch, the Scratch Team, or the Scratch Foundation.
      </div>
      <div className="footer-links">
        <div className="footer-group">
          <h4>About</h4>
          <a href="/about">About</a><br />
          <a href="/credits">Credits</a><br />
        </div>
        <div className="footer-group">
          <h4>Resources</h4>
          <a href="/articles">Articles</a><br />
          <a href="/faq">FAQ</a><br />
          <a href="https://github.com/The-Scratch-Channel/the-scratch-channel.github.io/issues/new/choose">Report an Issue</a>
        </div>
        <div className="footer-group">
          <h4>Community</h4>
          <a href="/">Forum Topic</a><br />
          <a href="/events">TSC Studio</a><br />
          <a href="/social">GitHub</a>
        </div>
      </div>
      <br />
      <h4 className="footer-copyright-info">
        © {new Date().getFullYear()} The Scratch Channel
      </h4>
    </footer>
  );
}