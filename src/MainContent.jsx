import React from "react";

export default function MainContent() {
    return (
        <div className="main">
            <h2>Welcome to The Scratch Channel!</h2>
            <p>Here, you can find articles, news stories, and more.</p>
            <p>
                Are you a developer or a person who found a security vulnerability? Report it on our {" "}
                <a
                    href="https://github.com/The-Scratch-Channel/the-scratch-channel.github.io/security/advisories"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub security page
                </a>.
            </p>
            <center>
                <div className="actions">
                    <a href="/articles.html">Articles</a> | <a href="/login.html">Log In</a> | {" "}
                    <a href="https://scratch.mit.edu/projects/1149116249/">Scratch Project</a>
                </div>
            </center>
        </div>
    );
}