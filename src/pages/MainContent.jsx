import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainContent() {
    const [categories, setCategories] = useState([]);
    const [articlesByCategory, setArticlesByCategory] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

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

                        // Extract metadata (assuming last column is category)
                        const metadataRow = lines[2].trim();
                        if (!metadataRow.startsWith("|") || !metadataRow.endsWith("|")) return null;
                        const metadataValues = metadataRow.split("|").map(s => s.trim()).filter(s => s.length > 0);
                        if (metadataValues.length < 4) return null; // title, author, date, category

                        const [title, author, date, category] = metadataValues;

                        return {
                            filename: file,
                            title,
                            author,
                            date,
                            category
                        };
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
        navigate(`/article/${article.filename}/${article.category}`);
    };

    if (selectedCategory) {
        // Show only articles in selected category
        return (
            <div className="page">
                <button onClick={() => setSelectedCategory(null)}>← Back to Categories</button>
                <h2>{selectedCategory}</h2>
                <div className="articles-container">
                    {articlesByCategory[selectedCategory].map((article, idx) => (
                        <div key={idx} className="article-card" onClick={() => openArticle(article)}>
                            <h3>{article.title}</h3>
                            <p>By {article.author} | {article.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Show all categories
    return (
        <div className="page">
            <h1>Welcome to The Scratch Channel!</h1>
            <h2>Categories</h2>
            <div className="categories-container">
                {categories.map((cat, idx) => (
                    <div
                        key={idx}
                        className="category-card"
                        onClick={() => setSelectedCategory(cat)}
                        style={{ cursor: "pointer", border: "1px solid #ccc", padding: "1rem", margin: "0.5rem 0" }}
                    >
                        {cat}
                    </div>
                ))}
            </div>
        </div>
    );
}
