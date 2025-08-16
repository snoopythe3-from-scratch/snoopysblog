import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainContent() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    const folder = "https://myscratchblocks.onrender.com/the-scratch-channel/articles";

    useEffect(() => {
        async function fetchArticles() {
            try {
                const res = await fetch(`${folder}/index.json`);
                const data = await res.json();

                // group articles by category
                const grouped = {};
                data.forEach(article => {
                    if (!grouped[article.category]) grouped[article.category] = [];
                    grouped[article.category].push(article);
                });

                setCategories(grouped);
            } catch (err) {
                console.error("Error loading articles:", err);
            }
        }

        fetchArticles();
    }, []);

    const openArticle = (article) => {
        navigate(`/article/${article.filename}/${article.category}`);
    };

    return (
        <div className="page">
            <h1 style={{ textAlign: "center" }}>Welcome to The Scratch Channel!</h1>
            <p style={{ textAlign: "center" }}>Here, you can find articles, news stories, and more.</p>
            <p style={{ textAlign: "center" }}>We aim to post at 1pm BST daily but sometimes we can forget.</p>
            <hr id="articles-begin" />

            {/* If no category selected, show category list */}
            {!selectedCategory && (
                <div className="categories-container" style={{ display: "grid", gap: "1rem" }}>
                    {Object.keys(categories).map((cat, i) => (
                        <div
                            key={i}
                            className="category-card"
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "1rem",
                                cursor: "pointer",
                                textAlign: "center"
                            }}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            <h2>{cat}</h2>
                            <p>{categories[cat].length} articles</p>
                        </div>
                    ))}
                </div>
            )}

            {/* If a category is selected, show its articles */}
            {selectedCategory && (
                <div>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        style={{
                            marginBottom: "1rem",
                            padding: "0.5rem 1rem",
                            background: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        ← Back to Categories
                    </button>
                    <h2>{selectedCategory}</h2>
                    <div className="articles-container">
                        {categories[selectedCategory].map((article, idx) => (
                            <div key={idx} className="article-card">
                                <div className="card-header">
                                    <h3>{article.title}</h3>
                                    <div className="meta">
                                        <span className="author">By: {article.author}</span>
                                        <span className="date">Date: {article.date}</span>
                                    </div>
                                </div>
                                <div className="read-more" onClick={() => openArticle(article)}>
                                    Read More →
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
