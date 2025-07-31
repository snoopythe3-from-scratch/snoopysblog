import React, { useState } from "react";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { useNavigate } from "react-router-dom";

export default function CreateArticle() {
    const [markdown, setMarkdown] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const navigate = useNavigate();

    const handleDownload = () => {
        if (!title || !author) {
            alert("Title and Author are required.");
            return;
        }

        const metadata = `| Title | Author | Date |\n|-------|--------|------|\n| ${title} | ${author} | ${date} |\n\n`;
        const blob = new Blob([metadata + markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const previewHtml = sanitizeHtml(marked.parse(markdown || ''));

    return (
        <div className="create-article-page" style={{ padding: "2rem" }}>
            <h1>Create a New Article</h1>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Author</label>
                <input
                    type="text"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{ padding: "0.5rem", marginTop: "0.3rem" }}
                />
            </div>

            <div className="editor-container" style={{ display: "flex", gap: "1rem" }}>
                <textarea
                    className="markdown-input"
                    placeholder="Write your markdown here..."
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    style={{
                        width: "50%",
                        height: "400px",
                        padding: "1rem",
                        fontFamily: "monospace",
                        border: "1px solid #ccc",
                        resize: "vertical"
                    }}
                />
                <div
                    className="markdown-preview"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                    style={{
                        width: "50%",
                        height: "400px",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        padding: "1rem",
                        background: "#fafafa"
                    }}
                />
            </div>

            <div className="button-group" style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button onClick={handleDownload}>Download Markdown</button>
                <button onClick={() => navigate('/')}>Cancel</button>
            </div>
        </div>
    );
}

