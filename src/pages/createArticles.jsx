import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function CreateArticle() {
  const navigate = useNavigate();
  const scratchUser = localStorage.getItem("scratchUser");
  const [title, setTitle] = useState("");
  const [date] = useState(new Date().toISOString().split("T")[0]);

  // Allowed admins
  const allowedAdmins = [
    "SmartCat3",
    "Swiftpixel",
    "scratchcode1_2_3",
    "kRxZy_kRxZy",
    "GvYoutube",
    "snoopythe3",
  ];
  const isAdmin = allowedAdmins.includes(scratchUser);

  // Categories (no "Questions")
  const categories = ["TSC Announcements", "TSC Update Log", "Scratch News"];
  const [category, setCategory] = useState(categories[0]);

  // Setup Tiptap Editor
  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, Link, Image],
    content: "",
  });

  if (!scratchUser) return <div className="container mt-4 alert alert-warning">⚠️ You must be logged in to post.</div>;
  if (!isAdmin) return <div className="container mt-4 alert alert-danger">🚫 Only admins can create posts.</div>;

  const handleSubmit = async () => {
    if (!title) {
      alert("Title is required.");
      return;
    }

    const content = editor.getHTML(); // get HTML from editor

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
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      alert("✅ Article submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting article:", error);
      alert("❌ Failed to submit article. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h1 className="mb-4">✍️ Create Article</h1>

        {/* Title */}
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

        {/* Author */}
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

        {/* Date */}
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            className="form-control"
            type="date"
            value={date}
            readOnly
            disabled
          />
        </div>

        {/* Category */}
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

        {/* Tiptap Editor */}
        <div className="mb-3">
          <label className="form-label">Content</label>
          <div className="border rounded p-3" style={{ minHeight: "250px", background: "#fff" }}>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Buttons */}
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
