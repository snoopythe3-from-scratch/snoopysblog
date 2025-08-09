import React, { useEffect, useState } from "react";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { useNavigate } from "react-router-dom";

export default function MainContent() {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const navigate = useNavigate();

    const folder = "/articles"; 

    useEffect(() => {
        async function fetchArticles() {
            try {
                const fileListRes = await fetch(`${folder}/index.json`);
                const files = await fileListRes.json();

                const markdownFiles = files.filter(name => name.endsWith(".md"));

                const fetchedArticles = await Promise.all(
                    markdownFiles.map(async (filename) => {
                        try {
                            const fileRes = await fetch(`${folder}/${filename}`);
                            const text = await fileRes.text();
                            const lines = text.split("\n");

                            if (lines.length < 3) {
                                console.warn(`Skipping ${filename}: not enough lines`);
                                return null;
                            }

                            const metadataRow = lines[2].trim();

                            if (!metadataRow.startsWith("|") || !metadataRow.endsWith("|")) {
                                console.warn(`Skipping ${filename}: invalid metadata row`);
                                return null;
                            }

                            const metadataValues = metadataRow
                                .split("|")
                                .map(s => s.trim())
                                .filter(s => s.length > 0);

                            if (metadataValues.length < 3) {
                                console.warn(`Skipping ${filename}: not enough metadata`);
                                return null;
                            }

                            const [title, author, date] = metadataValues;

                            const contentStartIndex = lines.findIndex((line, i) => i > 2 && line.trim() !== "");

                            if (contentStartIndex === -1) {
                                console.warn(`Skipping ${filename}: no content`);
                                return null;
                            }

                            const content = await marked.parse(lines.slice(contentStartIndex).join("\n"));

                            const textContent = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });
                            const preview = textContent.length > 300
                                ? textContent.substring(0, 150) + '...'
                                : textContent;

                            let thumbnail = null;
                            const imgRegex = /<img[^>]+src="([^">]+)"/;
                            const imgMatch = content.match(imgRegex);
                            if (imgMatch && imgMatch[1]) {
                                thumbnail = imgMatch[1];
                            }

                            return { title, author, date, content, preview, filename, thumbnail };
                        } catch (err) {
                            console.error(`Failed to process ${filename}:`, err);
                            return null;
                        }
                    })
                );

                const validArticles = fetchedArticles.filter(article => article !== null);
                setArticles(validArticles);
            } catch (error) {
                console.error("Failed to fetch local article list:", error);
            }
        }

        fetchArticles();
    }, []);

    const openArticle = (article) => {
        navigate(`/article/${article.filename}`);
    };

    const closeArticle = (e) => {
        if (e.target.classList.contains('modal-overlay') ||
            e.target.classList.contains('close-button')) {
            setSelectedArticle(null);
            document.body.style.overflow = 'auto';
        }
    };

    return (
        <div className="page">
            <h1><centre>Welcome to The Scratch Channel!</centre></h1>
            <p><centre>Here, you can find articles, news stories, and more.</centre></p>
            <p><centre>We aim to post at 1pm BST daily but sometimes we can forget.</centre></p>
            <hr id="articles-begin"/>

            <div className="articles-container">
                {articles.map((article, index) => (
                    <div
                        key={index}
                        className="article-card"
                        onClick={() => openArticle(article)}
                    >
                        {article.thumbnail && (
                            <div className="card-thumbnail">
                                <img src={article.thumbnail} alt="Article thumbnail" />
                            </div>
                        )}
                        <div className="card-header">
                            <h3>{article.title}</h3>
                            <div className="meta">
                                <span className="author">By: {article.author}</span>
                                <span className="date">Date: {article.date}</span>
                            </div>
                        </div>
                        <div className="card-content">
                            <p>{article.preview}</p>
                        </div>
                        <div className="read-more">Read More →</div>
                    </div>
                ))}
            </div>

            {selectedArticle && (
                <div className="modal-overlay" onClick={closeArticle}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <button className="close-button" onClick={closeArticle}>×</button>
                            <h2>{selectedArticle.title}</h2>
                            <div className="meta">
                                <span className="author">By: {selectedArticle.author}</span>
                                <span className="date">Date: {selectedArticle.date}</span>
                            </div>
                        </div>
                        {selectedArticle.thumbnail && (
                            <div className="modal-thumbnail">
                                <img src={selectedArticle.thumbnail} alt="Article thumbnail" />
                            </div>
                        )}
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
