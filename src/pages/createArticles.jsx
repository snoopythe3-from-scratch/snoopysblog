import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  imagePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertImage
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

export default function CreateArticle() {
  const navigate = useNavigate();
  const scratchUser = localStorage.getItem("scratchUser");
  const [markdown, setMarkdown] = useState('');
  const [title, setTitle] = useState('');
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  // Allowed admin users
  const allowedAdmins = [
    "SmartCat3",
    "Swiftpixel",
    "scratchcode1_2_3",
    "kRxZy_kRxZy",
    "GvYoutube",
    "snoopythe3",
  ];

  const isAdmin = allowedAdmins.includes(scratchUser);

  // Categories
  const categories = [
    "TSC Announcements",
    "TSC Update Log",
    "Scratch News",
    "Questions"
  ];

  // Default category
  const [category, setCategory] = useState("Questions");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (!scratchUser) {
    return <div>You must be logged in to post.</div>;
  }

  const handleSubmit = async () => {
    if (!title) {
      alert("Title is required.");
      return;
    }

    const [year, month, day] = date.split('-');
    const formattedDate = `${day}/${month}/${year.slice(2)}`;

    const payload = {
      title,
      author: scratchUser, // now safely part of JSON
      date: formattedDate,
      category,
      content: markdown
    };

    try {
      const response = await fetch("https://myscratchblocks.onrender.com/the-scratch-channel/articles/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      alert("Article submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting article:", error);
      alert("Failed to submit article. Please try again.");
    }
  };

  return (
    <div className="create-article-page" style={{ padding: "2rem" }}>
      <h1>Create Article</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Author</label>
        <input
          type="text"
          value={scratchUser}
          readOnly
          disabled
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem", background: "#e9ecef", cursor: "not-allowed" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Date</label>
        <input
          type="date"
          value={date}
          readOnly
          disabled
          style={{ padding: "0.5rem", marginTop: "0.3rem", background: "#e9ecef", cursor: "not-allowed" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          disabled={!isAdmin}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        {!isAdmin && <small>Category is fixed for non-admins.</small>}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <MDXEditor
          markdown={markdown}
          onChange={setMarkdown}
          contentEditableClassName="prose"
          className={isDark ? "dark-theme" : undefined}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            linkPlugin(),
            quotePlugin(),
            tablePlugin(),
            thematicBreakPlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                js: 'JavaScript',
                ts: 'TypeScript',
                py: 'Python',
                java: 'Java',
                cpp: 'C++',
                cs: 'C#',
                css: 'CSS',
                html: 'HTML',
                xml: 'XML',
                json: 'JSON',
                md: 'Markdown',
                txt: 'text'
              }
            }),
            imagePlugin(),
            markdownShortcutPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <ListsToggle />
                  <BlockTypeSelect />
                  <CreateLink />
                  <InsertTable />
                  <InsertImage />
                </>
              )
            })
          ]}
          style={{
            height: "400px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            overflow: "auto",
            backgroundColor: isDark ? "#23272e" : "#fff",
            color: isDark ? "#f5f5f5" : undefined
          }}
        />
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={handleSubmit}
          style={{ padding: "0.5rem 1rem", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Submit
        </button>
        <button
          onClick={() => navigate('/')}
          style={{ padding: "0.5rem 1rem", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
