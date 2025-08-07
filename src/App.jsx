import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainContent from "./pages/MainContent";
import Footer from "./components/Footer";
import CreateArticle from "./pages/createArticles";
import About from "./pages/About";
import ArticlePage from "./pages/ArticlePage";

import "./styles/index-revamp.css";
import "./styles/article.css";
import "./styles/article-page.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/articles/create" element={<CreateArticle />} />
        <Route path="/about" element={<About />} />
        <Route path="/article/:filename" element={<ArticlePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;