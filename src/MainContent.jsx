import React, { useEffect, useState } from "react";
import { marked } from "marked";

export default function MainContent() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        async function fetchArticles() {
            const res = await fetch("/articles/index.json");
            const files = await res.json();

            const fetchedArticles = await Promise.all(
                files.map(async (filename) => {
                    try {
                        const res = await fetch(`/articles/${filename}`);
                        const text = await res.text();
                        const lines = text.split("\n");

                        // Changed to require minimum 3 lines (header, separator, data)
                        if (lines.length < 3) {
                            console.warn(`Skipping ${filename}: not enough lines`);
                            return null;
                        }

                        // Changed to use 2nd index (3rd line) for data row
                        const metadataRow = lines[2].trim();

                        if (!metadataRow.startsWith("|") || !metadataRow.endsWith("|")) {
                            console.warn(`Skipping ${filename}: invalid table row format`);
                            return null;
                        }

                        const metadataValues = metadataRow
                            .split("|")
                            .map(s => s.trim())
                            .filter(s => s.length > 0);

                        if (metadataValues.length < 3) {
                            console.warn(`Skipping ${filename}: not enough metadata values`);
                            return null;
                        }

                        const [title, author, date] = metadataValues;

                        // Changed to start searching after table (i > 2)
                        const contentStartIndex = lines.findIndex((line, i) => i > 2 && line.trim() !== "");

                        // Handle case where no content is found
                        if (contentStartIndex === -1) {
                            console.warn(`Skipping ${filename}: no content found`);
                            return null;
                        }

                        // Added await for async parsing
                        const content = await marked.parse(lines.slice(contentStartIndex).join("\n"));

                        return { title, author, date, content, filename };
                    } catch (err) {
                        console.error(`Failed to load ${filename}:`, err);
                        return null;
                    }
                })
            );

            // Filter out nulls and fix variable name
            const validArticles = fetchedArticles.filter(article => article !== null);

            // Set articles with valid ones
            setArticles(validArticles);

            // Debug logs (optional)
            console.log("Raw files:", files);
            console.log("Fetched articles:", fetchedArticles);
            console.log("Valid articles:", validArticles);
        }

        fetchArticles();
    }, []);

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
            <div className="actions">
                <a href="/articles.html">Articles</a> | <a href="/login.html">Log In</a> | {" "}
                <a href="https://scratch.mit.edu/projects/1149116249/">Scratch Project</a>
            </div>
            <hr />
            <div className="articles">
                {articles.map((article, index) => (
                    <div key={index} className="article">
                        <h3>{article.title}</h3>
                        <p><strong>By:</strong> {article.author} | <strong>Date:</strong> {article.date}</p>
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}
