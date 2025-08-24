import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { category: routeCategory } = useParams();

  const [title, setTitle] = useState("");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const categories = ["TSC Announcements", "TSC Update Log", "Scratch News"];
  const [category, setCategory] = useState(
    categories.includes(routeCategory) ? routeCategory : categories[0]
  );

  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, Link, Image],
    content: "",
  });

  if (!profile?.writer) return <p>Not authorized to create articles</p>;

  const handleSubmit = async () => {
    if (!title) return alert("Title is required");
    const content = editor.getHTML();

    await addDoc(collection(db, "articles"), {
      title,
      author: profile.username,
      date,
      category,
      content,
      createdAt: serverTimestamp(),
    });

    navigate("/");
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h1 className="mb-4">Create Article</h1>

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
            value={profile.username}
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
          <EditorContent editor={editor} />
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
