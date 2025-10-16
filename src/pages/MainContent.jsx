import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";

export default function MainContent() {
  const [categories, setCategories] = useState([]); // all categories
  const [articlesByCategory, setArticlesByCategory] = useState({}); // articles grouped by category
  const [selectedCategory, setSelectedCategory] = useState(null); // currently selected category
  const [user, setUser] = useState(null); // logged-in user
  const [userReactions, setUserReactions] = useState({}); // current user's reactions
  const [animate, setAnimate] = useState({}); // animation for reactions
  const navigate = useNavigate();
  const [t] = useTranslation();

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  // Fetch articles from Firestore
  useEffect(() => {
    async function fetchArticles() {
      const snapshot = await getDocs(collection(db, "articles"));
      const grouped = {};

      for (let docSnap of snapshot.docs) {
        const data = docSnap.data();
        const id = docSnap.id;
        let thumbnail = data.thumbnail || "";
        let contentHtml = data.content || "";

        // Remove all images except the first one
        if (typeof document !== "undefined") {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = contentHtml;
          const imgs = wrapper.getElementsByTagName("img");
          if (imgs.length > 0 && !thumbnail) thumbnail = imgs[0].src;
          Array.from(wrapper.getElementsByTagName("img")).forEach(img => img.remove());
          contentHtml = wrapper.innerHTML;
        }

        const article = {
          id,
          title: data.title,
          author: data.author,
          date: data.date,
          category: data.category,
          thumbnail,
          content: contentHtml,
          reactions: {
            thumbsUp: data.thumbsUp || 0,
            thumbsDown: data.thumbsDown || 0,
            heart: data.heart || 0,
          },
        };

        if (!grouped[article.category]) grouped[article.category] = [];
        grouped[article.category].push(article);

        if (user) {
          const userDoc = await getDoc(doc(db, "articles", id, "reactions", user.uid));
          setUserReactions(prev => ({ ...prev, [id]: userDoc.exists() ? userDoc.data() : {} }));
        }
      }

      setCategories(Object.keys(grouped));
      setArticlesByCategory(grouped);
    }
    fetchArticles();
  }, [user]);

  const stripHtml = html => html?.replace(/<[^>]*>/g, "") || "";
  const makeSnippet = (html, max = 300) => stripHtml(html).slice(0, max) + (stripHtml(html).length > max ? "..." : "");

  const handleReaction = async (articleId, type) => {
    if (!user || userReactions[articleId]?.[type]) return;
    setAnimate(prev => ({ ...prev, [articleId]: { ...(prev[articleId] || {}), [type]: true } }));
    setTimeout(() => setAnimate(prev => ({ ...prev, [articleId]: { ...(prev[articleId] || {}), [type]: false } })), 200);

    await updateDoc(doc(db, "articles", articleId), { [type]: increment(1) });
    await setDoc(doc(db, "articles", articleId, "reactions", user.uid), { [type]: true }, { merge: true });

    setUserReactions(prev => ({ ...prev, [articleId]: { ...(prev[articleId] || {}), [type]: true } }));
    setArticlesByCategory(prev => {
      const updated = { ...prev };
      for (let cat in updated) {
        updated[cat] = updated[cat].map(a => a.id === articleId ? { ...a, reactions: { ...a.reactions, [type]: a.reactions[type] + 1 } } : a);
      }
      return updated;
    });
  };

  if (!selectedCategory) {
    const allArticles = Object.values(articlesByCategory).flat();
    allArticles.sort((a, b) => ((b.reactions.thumbsUp + b.reactions.heart) || 0) - ((a.reactions.thumbsUp + a.reactions.heart) || 0));
    const topArticles = allArticles.slice(0, 6); // top 6 by likes + hearts

    return (
      <>
        <div id="categories-header">
          <div className="categories-container">
            {categories.map(cat => (
              <div key={cat} className="category-card" onClick={() => setSelectedCategory(cat)}>
                {cat} ({articlesByCategory[cat]?.length || 0})
              </div>
            ))}
          </div>
        </div>
        <div className="page">
          <h1 style={{ textAlign: "center" }}>{t("main.welcome")}</h1>
          <div className="articles-container">
            {topArticles.map(article => (
              <div key={article.id} className="article-card">
                {article.thumbnail && <div className="card-thumbnail"><img src={article.thumbnail} alt="" loading="lazy" /></div>}
                <div className="card-header">
                  <h3>{article.title}</h3>
                  <div className="meta">
                    <span>{t("main.by")}: {article.author}</span>
                    <span>{t("main.date")}: {article.date}</span>
                  </div>
                </div>
                <div className="card-content"><p>{makeSnippet(article.content)}</p></div>
                <div className="reactions">
                  <button
                    className={`reaction-btn ${animate[article.id]?.thumbsUp ? "animate" : ""}`}
                    onClick={() => handleReaction(article.id, "thumbsUp")}
                    style={{ color: userReactions[article.id]?.thumbsUp ? "#0d6efd" : "grey" }}
                  >👍 {article.reactions.thumbsUp}</button>
                  <button
                    className={`reaction-btn ${animate[article.id]?.thumbsDown ? "animate" : ""}`}
                    onClick={() => handleReaction(article.id, "thumbsDown")}
                    style={{ color: userReactions[article.id]?.thumbsDown ? "#dc3545" : "grey" }}
                  >👎 {article.reactions.thumbsDown}</button>
                  <button
                    className={`reaction-btn ${animate[article.id]?.heart ? "animate" : ""}`}
                    onClick={() => handleReaction(article.id, "heart")}
                    style={{ color: userReactions[article.id]?.heart ? "#ff4081" : "grey" }}
                  >❤️ {article.reactions.heart}</button>
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
        {articles.map(article => (
          <div key={article.id} className="article-card">
            {article.thumbnail && <div className="card-thumbnail"><img src={article.thumbnail} alt="" loading="lazy" /></div>}
            <div className="card-header">
              <h3>{article.title}</h3>
              <div className="meta">
                <span>{t("main.by")}: {article.author}</span>
                <span>{t("main.date")}: {article.date}</span>
              </div>
            </div>
            <div className="card-content"><p>{makeSnippet(article.content)}</p></div>
            <div className="reactions">
              <button
                className={`reaction-btn ${animate[article.id]?.thumbsUp ? "animate" : ""}`}
                onClick={() => handleReaction(article.id, "thumbsUp")}
                style={{ color: userReactions[article.id]?.thumbsUp ? "#0d6efd" : "grey" }}
              >👍 {article.reactions.thumbsUp}</button>
              <button
                className={`reaction-btn ${animate[article.id]?.thumbsDown ? "animate" : ""}`}
                onClick={() => handleReaction(article.id, "thumbsDown")}
                style={{ color: userReactions[article.id]?.thumbsDown ? "#dc3545" : "grey" }}
              >👎 {article.reactions.thumbsDown}</button>
              <button
                className={`reaction-btn ${animate[article.id]?.heart ? "animate" : ""}`}
                onClick={() => handleReaction(article.id, "heart")}
                style={{ color: userReactions[article.id]?.heart ? "#ff4081" : "grey" }}
              >❤️ {article.reactions.heart}</button>
            </div>
            <div className="read-more" onClick={() => navigate(`${selectedCategory}/article/${article.id}`)}>{t("main.readmore")} →</div>
          </div>
        ))}
      </div>
      <style>{`
        .reactions { display: flex; gap: 12px; margin-top: 10px; }
        .reaction-btn { font-size: 15px; background: none; border: none; cursor: pointer; transition: transform 0.2s; }
        .reaction-btn.animate { transform: scale(1.4); }
      `}</style>
    </div>
  );
}
