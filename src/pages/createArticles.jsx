import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateArticle({ user, profile }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const categories = ["TSC Announcements", "TSC Update Log", "Scratch News"];
  const [category, setCategory] = useState(categories[0]);

  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, Link, Image],
    content: "",
  });

  // Block non-writers
  if (!profile?.writer) {
    return (
      <div className="container mt-4 alert alert-danger">
        You are not allowed to create articles.
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!title) return alert("Title is required.");
    const content = editor.getHTML();

    try {
      await addDoc(collection(db, "articles"), {
        title,
        author: user.email, // or user.displayName if you prefer
        date,
        category,
        content,
        createdAt: serverTimestamp(),
      });
      alert("Article submitted to Firebase!");
      navigate("/");
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save article. Please try again.");
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
            value={user.email}
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

        {/* Content */}
        <div className="mb-3">
          <label className="form-label">Content</label>
          <EditorContent editor={editor} />
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
