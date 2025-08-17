import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { marked } from "marked";

export function ArticlePage() {
    const { filename } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const scratchUser = sessionStorage.getItem("scratchUser");
    if (!scratchUser) {
        navigate('/login');
    }
        
    useEffect(() => {
        async function fetchArticle() {
            try {
                const fileRes = await fetch(
                    `https://myscratchblocks.onrender.com/the-scratch-channel/articles/${filename}`
                );
                const text = await fileRes.text();
                const lines = text.split("\n");

                if (lines.length < 3) return;
                const metadataRow = lines[2].trim();
                if (!metadataRow.startsWith("|") || !metadataRow.endsWith("|")) return;
                const metadataValues = metadataRow
                    .split("|")
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
                if (metadataValues.length < 3) return;

                const [title, , date] = metadataValues;
                const contentStartIndex = lines.findIndex(
                    (line, i) => i > 2 && line.trim() !== ""
                );
                if (contentStartIndex === -1) return;

                const content = await marked.parse(
                    lines.slice(contentStartIndex).join("\n")
                );

                let thumbnail = null;
                const imgRegex = /<img[^>]+src="([^">]+)"/;
                const imgMatch = content.match(imgRegex);
                if (imgMatch && imgMatch[1]) {
                    thumbnail = imgMatch[1];
                }

                setArticle({
                    title,
                    author: scratchUser
                    date,
                    content,
                    filename,
                    thumbnail
                });
            } catch (error) {
                console.error("Failed to fetch article:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchArticle();
    }, [filename, scratchUser]);

    if (loading) {
        return <div>Loading article...</div>;
    }

    if (!article) {
        return <div>Article not found</div>;
    }

    return (
        <div className="page article-full">
            <div className="article-header">
                <h1>{article.title}</h1>
                <div className="meta">
                    <span className="author">By: {article.author}</span>
                    <span className="date">Date: {article.date}</span>
                </div>
            </div>
            {article.thumbnail && (
                <div className="article-thumbnail">
                    <img src={article.thumbnail} alt="Article thumbnail" />
                </div>
            )}
            <div
                className="article-full-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </div>
    );
}

export function PostForm({ category, onSubmit }) {
    const scratchUser = sessionStorage.getItem("scratchUser");
    const allowedAdmins = [
        "SmartCat3",
        "Swiftpixel",
        "scratchcode1_2_3",
        "kRxZy_kRxZy",
        "GvYoutube",
        "snoopythe3"
    ];
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    if (!scratchUser) {
        return <div>You must be logged in to post.</div>;
    }

    const isAdmin = allowedAdmins.includes(scratchUser);
    if (!isAdmin && category !== "Questions") {
        return <div>You can only post to the Questions section.</div>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            title,
            author: scratchUser,
            category,
            content,
            date: new Date().toISOString(),
        };
        onSubmit(newPost);
    };

    return (
        <form onSubmit={handleSubmit} className="post-form">
            <h2>Create a Post in {category}</h2>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Post</button>
        </form>
    );
}
