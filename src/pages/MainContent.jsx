import React, { useEffect, useState, useRef } from "react";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { useNavigate } from "react-router-dom";

export default function MainContent() {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const articleID = useRef({});

    const folder = "https://myscratchblocks.onrender.com/the-scratch-channel/articles";

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

                            if (lines.length < 3) return null;

                            const metadataRow = lines[2].trim();
                            if (!metadataRow.startsWith("|") || !metadataRow.endsWith("|")) return null;

                            const metadataValues = metadataRow
                                .split("|")
                                .map(s => s.trim())
                                .filter(s => s.length > 0);

                            if (metadataValues.length < 3) return null;

                            const [title, author, date] = metadataValues;
                            articleID.current[title] = filename;

                            const contentStartIndex = lines.findIndex((line, i) => i > 2 && line.trim() !== "");
                            if (contentStartIndex === -1) return null;

                            const content = marked.parse(lines.slice(contentStartIndex).join("\n"));
                            const textContent = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });

                            const words = textContent.split(/\s+/);
                            const preview = words.length > 25
                                ? words.slice(0, 25).join(" ") + "..."
                                : textContent;

                            let thumbnail = null;
                            const imgRegex = /<img[^>]+src="([^">]+)"/;
                            const imgMatch = content.match(imgRegex);
                            if (imgMatch && imgMatch[1]) thumbnail = imgMatch[1];

                            return { title, author, date, preview, thumbnail };
                        } catch {
                            return null;
                        }
                    })
                );

                setArticles(fetchedArticles.filter(Boolean));
            } catch {}
        }

        fetchArticles();
    }, []);

    const openArticle = (article) => {
        navigate(`article/${articleID.current[article.title]}`);
    };

    return (
        <div className="page">
            <h1 style={{ textAlign: 'center' }}>Welcome to The Scratch Channel!</h1>
            <p style={{ textAlign: 'center' }}>Here, you can find articles, news stories, and more.</p>
            <p style={{ textAlign: 'center' }}>We aim to post at 1pm BST daily but sometimes we can forget.</p>
            <hr id="articles-begin" />

            <div className="articles-container">
                {articles.map((article, index) => (
                    <div key={index} className="article-card">
                        {article.thumbnail && (
                            <div className="card-thumbnail">
                                <img 
                                    src={article.thumbnail} 
                                    alt="Article thumbnail" 
                                    loading="lazy"
                                />
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
                        <div className="read-more" onClick={() => openArticle(article)}>
                            Read More →
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
