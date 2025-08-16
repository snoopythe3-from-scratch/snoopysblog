import React, { useEffect, useState, useRef } from "react";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { useNavigate } from "react-router-dom";

export default function MainContent() {
    const [categories, setCategories] = useState([]);
    const [articlesByCategory, setArticlesByCategory] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();
    const articleID = useRef({});

    const folder = "https://myscratchblocks.onrender.com/the-scratch-channel/articles";

    useEffect(() => {
        async function fetchArticles() {
            try {
                const res = await fetch(`${folder}/index.json`);
                const files = await res.json();

                const articles = await Promise.all(
                    files.map(async (file) => {
                        const articleRes = await fetch(`${folder}/${file}`);
                        const text = await articleRes.text();
                        const lines = text.split("\n");

                        if (lines.length < 3) return null;

                        // Extract metadata (title, author, date, category)
                        const metadataRow = lines[2].trim();
                        if (!metadataRow.startsWith("|") || !metadataRow.endsWith("|")) return null;
                        const metadataValues = metadataRow.split("|").map(s => s.trim()).filter(s => s.length > 0);
                        if (metadataValues.length < 4) return null;

                        const [title, author, date, category] = metadataValues;
                        articleID.current[title] = file;

                        const contentStartIndex = lines.findIndex((line, i) => i > 2 && line.trim() !== "");
                        if (contentStartIndex === -1) return null;

                        const contentHtml = marked.parse(lines.slice(contentStartIndex).join("\n"));
                        const textContent = sanitizeHtml(contentHtml, { allowedTags: [], allowedAttributes: {} });

                        const words = textContent.split(/\s+/);
                        const preview = words.length > 25 ? words.slice(0, 25).join(" ") + "..." : textContent;

                        let thumbnail = null;
                        const imgMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
                        if (imgMatch && imgMatch[1]) thumbnail = imgMatch[1];

                        return { filename: file, title, author, date, category, preview, thumbnail };
                    })
                );

                const validArticles = articles.filter(Boolean);

                // Build category list and group articles
                const grouped = {
                  "TSC Announcements": [],
                  "TSC Update Log": [],
                  "Scratch News": [],
                  "Questions": []
                };
                validArticles.forEach(article => {
                    if (!grouped[article.category]) grouped[article.category] = [];
                    grouped[article.category].push(article);
                });

                setCategories(Object.keys(grouped));
                setArticlesByCategory(grouped);
            } catch (err) {
                console.error("Error fetching articles:", err);
            }
        }

        fetchArticles();
    }, []);

    const openArticle = (article) => {
        navigate(`${selectedCategory}/article/${article.filename}`);
    };

    if (!selectedCategory) {
        // Display categories
        return (
            <div className="page">
                <h1 style={{ textAlign: "center" }}>Welcome to The Scratch Channel!</h1>
                <p style={{ textAlign: "center" }}>Click a category to view its articles.</p>
                <div className="categories-container">
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            className="category-card"
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Display articles in selected category
    const articles = articlesByCategory[selectedCategory] || [];

    return (
        <div className="page">
            <h1 style={{ textAlign: "center" }}>{selectedCategory}</h1>
            <button className="back-btn" onClick={() => setSelectedCategory(null)}>← Back to Categories</button>

            <div className="articles-container">
                {articles.map((article, index) => (
                    <div key={index} className="article-card">
                        {article.thumbnail && (
                            <div className="card-thumbnail">
                                <img src={article.thumbnail} alt="Article thumbnail" loading="lazy" />
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
