import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Markdown from "@tiptap/extension-markdown";

export default function CreateArticle() {
  const navigate = useNavigate();
  const [scratchUser, setScratchUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const allowedAdmins = ["SmartCat3", "Swiftpixel", "scratchcode1_2_3", "kRxZy_kRxZy", "GvYoutube", "snoopythe3"];
  const categories = ["TSC Announcements", "TSC Update Log", "Scratch News"];
  const [category, setCategory] = useState(categories[0]);

  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, Link, Image, Markdown],
    content: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("scratchToken");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`https://corsproxy.io/?url=https://scratch-id.onrender.com/verification/${token}`)
      .then((res) => res.json())
      .then((data) => {
        const sessionKey = Object.keys(data)[0];
        if (sessionKey && data[sessionKey]) {
          setScratchUser(data[sessionKey].user);
        }
      })
      .catch((err) => console.error("Auth error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!scratchUser)
    return (
      <div className="container mt-4 alert alert-warning">
        ⚠️ You must be logged in to post.
      </div>
    );
  if (!allowedAdmins.includes(scratchUser))
    return (
      <div className="container mt-4 alert alert-danger">
        🚫 Only admins can create posts.
      </div>
    );

  const handleSubmit = async () => {
    if (!title) return alert("Title is required.");

    const content = editor.storage.markdown.getMarkdown();
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}/${month}/${year.slice(2)}`;

    const fileContent = `| Title | Author | Date | Category |
|-------|--------|------|----------|
| ${title} | TSC Offical | ${formattedDate} | ${category} |

${content}
`;

    const file = new File([fileContent], `${title.replace(/\s+/g, "_")}.md`, {
      type: "text/markdown",
    });
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://myscratchblocks.onrender.com/the-scratch-channel/articles/create",
        { method: "POST", body: formData }
      );
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      alert("✅ Article submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting article:", error);
      alert("❌ Failed to submit article. Please try again.");
    }
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h1 className="mb-4">✍️ Create Article</h1>

        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your article title..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            className="form-control"
            type="text"
            value={scratchUser}
            readOnly
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input className="form-control" type="date" value={date} readOnly disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>

          {/* Toolbar */}
          <div className="btn-group mb-2" role="group">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              B
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              I
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              U
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                const url = prompt("Enter link URL");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
            >
              🔗
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={addImage}
            >
              🖼️
            </button>
          </div>

          <div className="editor-container border rounded p-2">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="d-flex gap-3 mt-3">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
