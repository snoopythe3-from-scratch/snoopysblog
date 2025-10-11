import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { marked } from "marked";

export default function MainContent() {
  const [categories, setCategories] = useState([]);
  const [articlesByCategory, setArticlesByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [userReactions, setUserReactions] = useState({});
  const [animate, setAnimate] = useState({});
  const navigate = useNavigate();
  const [t, i18n] = useTranslation();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      const snapshot = await getDocs(collection(db, "articles"));
      const grouped = {};

      for (let docSnap of snapshot.docs) {
        const data = docSnap.data();
        const id = docSnap.id;
        // Prepare content and thumbnail so the preview card shows at most one image.
        const rawContent = data.content || "";
        let thumbnail = data.thumbnail || "";
        let contentHtml = rawContent;

        // Helper to verify an image URL is reachable in the browser
        async function imageExists(url) {
          return new Promise((resolve) => {
            try {
              const img = new Image();
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
              img.src = url;
            } catch (e) {
              resolve(false);
            }
          });
        }

        // If content contains HTML images or Markdown image syntax, extract the first image
        // and remove all image occurrences from the preview content to ensure only one image shows.
        if (rawContent) {
          // First try to extract HTML <img> src
          let found = false;
          if (typeof document !== "undefined") {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = rawContent;
            const imgs = wrapper.getElementsByTagName("img");
            if (imgs.length > 0) {
              const src = imgs[0].getAttribute("src") || "";
              // verify the image actually loads before using it as thumbnail
              // (we'll await below since imageExists is async)
              thumbnail = thumbnail || src;
              found = true;
            }
            // Remove HTML img tags
            Array.from(wrapper.getElementsByTagName("img")).forEach(img => img.remove());
            contentHtml = wrapper.innerHTML;
          }

          // Also handle Markdown image syntax ![alt](url)
          if (!found) {
            const mdMatch = rawContent.match(/!\[[^\]]*\]\(([^)]+)\)/i);
            if (mdMatch) {
              thumbnail = thumbnail || mdMatch[1];
              found = true;
            }
          }

          // Remove Markdown image syntax from content
          contentHtml = contentHtml.replace(/!\[[^\]]*\]\(([^)]+)\)/gi, "");
          // Ensure any leftover HTML img tags are removed as a safety net
          contentHtml = contentHtml.replace(/<img[^>]*>/gi, "");
        }

        // If thumbnail exists, verify it loads; otherwise clear it.
        if (thumbnail) {
          const ok = await imageExists(thumbnail);
          if (!ok) thumbnail = "";
        }

        const article = {
          id,
          title: data.title,
          author: data.author,
          date: data.date,
          category: data.category,
          preview: data.preview || "",
          thumbnail: thumbnail,
          content: contentHtml,
          reactions: {
            thumbsUp: data.thumbsUp || 0,
            thumbsDown: data.thumbsDown || 0,
            heart: data.heart || 0,
          },
        };

        if (!grouped[article.category]) grouped[article.category] = [];
        grouped[article.category].push(article);

        // fetch user reactions if logged in
        if (user) {
          const userDocRef = doc(db, "articles", id, "reactions", user.uid);
          const userDoc = await getDoc(userDocRef);
          setUserReactions((prev) => ({
            ...prev,
            [id]: userDoc.exists() ? userDoc.data() : { thumbsUp: false, thumbsDown: false, heart: false },
          }));
        }
      }

      // Sort each category's articles newest -> oldest
      for (const cat of Object.keys(grouped)) {
        grouped[cat].sort((a, b) => {
          const ta = Date.parse(a.date) || 0;
          const tb = Date.parse(b.date) || 0;
          return tb - ta;
        });
      }

      setCategories(Object.keys(grouped));
      setArticlesByCategory(grouped);
    }

    fetchArticles();
  }, [user]);

  const handleReaction = async (articleId, type) => {
    if (!user) return;
    if (userReactions[articleId]?.[type]) return;

    setAnimate((prev) => ({ ...prev, [articleId]: { ...(prev[articleId] || {}), [type]: true } }));
    setTimeout(() => setAnimate((prev) => ({ ...prev, [articleId]: { ...(prev[articleId] || {}), [type]: false } })), 200);

    const articleRef = doc(db, "articles", articleId);
    await updateDoc(articleRef, { [type]: increment(1) });

    const userDocRef = doc(db, "articles", articleId, "reactions", user.uid);
    await setDoc(userDocRef, { ...(userReactions[articleId] || {}), [type]: true }, { merge: true });

    setUserReactions((prev) => ({
      ...prev,
      [articleId]: { ...(prev[articleId] || {}), [type]: true },
    }));

    setArticlesByCategory((prev) => {
      const updated = { ...prev };
      for (let cat in updated) {
        updated[cat] = updated[cat].map(a => a.id === articleId ? { ...a, reactions: { ...a.reactions, [type]: a.reactions[type] + 1 } } : a);
      }
      return updated;
    });
  };

  if (!selectedCategory) {
    // Flatten all articles to show on the homepage
    const allArticles = Object.values(articlesByCategory).flat();
    allArticles.sort((a, b) => {
      const ta = Date.parse(a.date) || 0;
      const tb = Date.parse(b.date) || 0;
      return tb - ta;
    });
    return (
      <>
      <div id="categories-header">
          <div className="categories-container">
            {categories.map((cat) => (
              <div key={cat} className="category-card" onClick={() => setSelectedCategory(cat)}>
                {cat} ({articlesByCategory[cat]?.length || 0})
              </div>
            ))}
          </div>
        </div>
      <div className="page">

        <h1 style={{ textAlign: "center" }}>{t("main.welcome")}</h1>


        <div className="articles-container">
          {allArticles.map((article) => (
            <div key={article.id} className="article-card">
              {article.thumbnail && <div className="card-thumbnail"><img src={article.thumbnail} alt="" loading="lazy" /></div>}
              <div className="card-header">
                <h3>{article.title}</h3>
                <div className="meta">
                  <span className="author">{t("main.by")}: {article.author}</span>
                  <span className="date">{t("main.date")}: {article.date}</span>
                </div>
              </div>
              <div className="card-content"><div dangerouslySetInnerHTML={{ __html: article.content || "" }} style={{ textAlign: 'center' }} /></div>
              <div className="reactions">
                <button
                  className={`reaction-btn ${animate[article.id]?.thumbsUp ? "animate" : ""}`}
                  onClick={() => handleReaction(article.id, "thumbsUp")}
                  style={{ color: userReactions[article.id]?.thumbsUp ? "#0d6efd" : "grey" }}
                >
                  👍 {article.reactions.thumbsUp}
                </button>
                <button
                  className={`reaction-btn ${animate[article.id]?.thumbsDown ? "animate" : ""}`}
                  onClick={() => handleReaction(article.id, "thumbsDown")}
                  style={{ color: userReactions[article.id]?.thumbsDown ? "#dc3545" : "grey" }}
                >
                  👎 {article.reactions.thumbsDown}
                </button>
                <button
                  className={`reaction-btn ${animate[article.id]?.heart ? "animate" : ""}`}
                  onClick={() => handleReaction(article.id, "heart")}
                  style={{ color: userReactions[article.id]?.heart ? "#ff4081" : "grey" }}
                >
                  ❤️ {article.reactions.heart}
                </button>
              </div>
              <div className="read-more" onClick={() => navigate(`${article.category}/article/${article.id}`)}>{t("main.readmore")} →</div>
            </div>
          ))}
        </div>
      </div>
      </>
    );
  }

  const articles = articlesByCategory[selectedCategory] || [];

  return (
    <div className="page">
      <h1 style={{ textAlign: "center" }}>{selectedCategory}</h1>
      <button className="back-btn" onClick={() => setSelectedCategory(null)}>← {t("main.back-cat")}</button>

      <div className="articles-container">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            {article.thumbnail && (
              <div className="card-thumbnail">
                <img src={article.thumbnail} alt="" loading="lazy" />
              </div>
            )}
            <div className="card-header">
              <h3>{article.title}</h3>
              <div className="meta">
                <span className="author">{t("main.by")}: {article.author}</span>
                <span className="date">{t("main.date")}: {article.date}</span>
              </div>
            </div>
            <div className="card-content"><div dangerouslySetInnerHTML={{ __html: article.content || "" }} style={{ textAlign: 'center' }} /></div>
            <div className="reactions">
              <button
                className={`reaction-btn ${animate[article.id]?.thumbsUp ? "animate" : ""}`}
                onClick={() => handleReaction(article.id, "thumbsUp")}
                style={{ color: userReactions[article.id]?.thumbsUp ? "#0d6efd" : "grey" }}
              >
                👍 {article.reactions.thumbsUp}
              </button>
              <button
                className={`reaction-btn ${animate[article.id]?.thumbsDown ? "animate" : ""}`}
                onClick={() => handleReaction(article.id, "thumbsDown")}
                style={{ color: userReactions[article.id]?.thumbsDown ? "#dc3545" : "grey" }}
              >
                👎 {article.reactions.thumbsDown}
              </button>
              <button
                className={`reaction-btn ${animate[article.id]?.heart ? "animate" : ""}`}
                onClick={() => handleReaction(article.id, "heart")}
                style={{ color: userReactions[article.id]?.heart ? "#ff4081" : "grey" }}
              >
                ❤️ {article.reactions.heart}
              </button>
            </div>
            <div className="read-more" onClick={() => navigate(`${selectedCategory}/article/${article.id}`)}>{t("main.readmore")} →</div>
          </div>
        ))}
      </div>

      <style>{`
        .reactions {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }
        .reaction-btn {
          font-size: 15px;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .reaction-btn.animate {
          transform: scale(1.4);
        }
      `}</style>
    </div>
  );
}