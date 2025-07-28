import React from "react";
export default function Header() {
    return (
        <div className="header">
            <p className="nav-logo">TSC</p>
            <nav className="nav-links">
                <a href="/">Home</a>
                <a href="/articles.html">Articles</a>
            </nav>
        </div>
    );
}
