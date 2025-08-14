import React, { useEffect, useState } from "react";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { useNavigate } from "react-router-dom";

export default function MainContent() {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const navigate = useNavigate();

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
                            const content = marked.parse(text);
                            const textContent = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });
                            if (textContent.length < 10) return null;
                            const preview = textContent.length > 300 ? textContent.substring(0, 150) + '...' : textContent;
                            let thumbnail = null;
                            const imgRegex = /<img[^>]+src="([^">]+)"/;
                            const imgMatch = content.match(imgRegex);
                            if (imgMatch && imgMatch[1]) thumbnail = imgMatch[1];
                            return { title: filename, content, preview, filename, thumbnail };
                        } catch (err) {
                            return null;
                        }
                    })
                );

                setArticles(fetchedArticles.filter(article => article !== null));
            } catch (error) {}
        }

        fetchArticles();
    }, []);

    const openArticle = (article) => {
        setSelectedArticle(article);
        document.body.style.overflow = 'hidden';
    };

    const closeArticle = (e) => {
        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('close-button')) {
            setSelectedArticle(null);
            document.body.style.overflow = 'auto';
        }
    };

    return (
        <div className="page">
            <h1 style={{ textAlign: 'center' }}>Welcome to The Scratch Channel!</h1>
            <p style={{ textAlign: 'center' }}>Here, you can find articles, news stories, and more.</p>
            <p style={{ textAlign: 'center' }}>We aim to post at 1pm BST daily but sometimes we can forget.</p>
            <hr id="articles-begin" />

            <div className="articles-container">
                {articles.map((article, index) => (
                    <div key={index} className="article-card" onClick={() => openArticle(article)}>
                        {article.thumbnail && (
                            <div className="card-thumbnail">
                                <img src={article.thumbnail} alt="Article thumbnail" />
                            </div>
                        )}
                        <div className="card-header">
                            <h3>{article.title}</h3>
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
                        </div>
                        {selectedArticle.thumbnail && (
                            <div className="modal-thumbnail">
                                <img src={selectedArticle.thumbnail} alt="Article thumbnail" />
                            </div>
                        )}
                        <div className="article-full-content" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                    </div>
                </div>
            )}
        </div>
    );
}
