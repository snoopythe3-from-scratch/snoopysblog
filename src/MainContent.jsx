import React, { useEffect, useState } from "react";
import { marked } from "marked";

export default function MainContent() {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);

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

                        if (lines.length < 3) {
                            console.warn(`Skipping ${filename}: not enough lines`);
                            return null;
                        }

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

                        const contentStartIndex = lines.findIndex((line, i) => i > 2 && line.trim() !== "");

                        if (contentStartIndex === -1) {
                            console.warn(`Skipping ${filename}: no content found`);
                            return null;
                        }

                        const content = await marked.parse(lines.slice(contentStartIndex).join("\n"));
                        
                        // Create preview by removing HTML tags and truncating
                        const textContent = content.replace(/<[^>]*>/g, "");
                        const preview = textContent.length > 150 
                            ? textContent.substring(0, 150) + '...' 
                            : textContent;

                        return { title, author, date, content, preview, filename };
                    } catch (err) {
                        console.error(`Failed to load ${filename}:`, err);
                        return null;
                    }
                })
            );

            const validArticles = fetchedArticles.filter(article => article !== null);
            setArticles(validArticles);
        }

        fetchArticles();
    }, []);

    const openArticle = (article) => {
        setSelectedArticle(article);
        document.body.style.overflow = 'hidden'; // Disable page scrolling
    };

    const closeArticle = () => {
        setSelectedArticle(null);
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

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
            <hr />
            
            <div className="articles-grid">
                {articles.map((article, index) => (
                    <div 
                        key={index} 
                        className="article-card"
                        onClick={() => openArticle(article)}
                    >
                        <div className="card-header">
                            <h3>{article.title}</h3>
                            <div className="meta">
                                <span className="author">{article.author}</span>
                                <span className="date">{article.date}</span>
                            </div>
                        </div>
                        <div className="card-content">
                            <p>{article.preview}</p>
                        </div>
                        <div className="read-more">Read More →</div>
                    </div>
                ))}
            </div>

            {/* Modal for full article */}
            {selectedArticle && (
                <div className="modal-overlay" onClick={closeArticle}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={closeArticle}>×</button>
                        <div className="modal-header">
                            <h2>{selectedArticle.title}</h2>
                            <div className="meta">
                                <span className="author">By: {selectedArticle.author}</span>
                                <span className="date">Date: {selectedArticle.date}</span>
                            </div>
                        </div>
                        <div 
                            className="article-full-content" 
                            dangerouslySetInnerHTML={{ __html: selectedArticle.content }} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}