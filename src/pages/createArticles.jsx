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
  const scratchUser = sessionStorage.getItem("scratchUser"); // logged-in user
  const [markdown, setMarkdown] = useState('');
  const [title, setTitle] = useState('');
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

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

    const metadata = `| Title | Author | Date | Category |\n|-------|--------|------|----------|\n| ${title} | ${scratchUser} | ${formattedDate} | Questions |\n\n`;
    const fileContent = metadata + markdown;

    const fileBlob = new Blob([fileContent], { type: 'text/markdown' });
    const fileName = `${title.replace(/\s+/g, '_')}.md`;

    const formData = new FormData();
    formData.append('file', fileBlob, fileName);

    try {
      const response = await fetch("https://myscratchblocks.onrender.com/the-scratch-channel/articles/create", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      alert("Article submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting article:", error);
      alert("Failed to submit article. Please try again.");
    }
  };

  return (
    <div className="create-article-page" style={{ padding: "2rem" }}>
      <h1>Ask a Question</h1>

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
          value={scratchUser}
          readOnly
          disabled
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem", background: "#e9ecef", cursor: "not-allowed" }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1rem" }}>
        <label>Date</label>
        <input
          type="date"
          value={date}
          readOnly
          disabled
          style={{ padding: "0.5rem", marginTop: "0.3rem", background: "#e9ecef", cursor: "not-allowed" }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1rem" }}>
        <label>Category</label>
        <input
          type="text"
          value="Questions"
          readOnly
          disabled
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem", background: "#e9ecef", cursor: "not-allowed" }}
        />
      </div>

      <div className="editor-container" style={{ marginBottom: "1rem" }}>
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

      <div className="button-group" style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Submit Question
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: "0.5rem 1rem",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
