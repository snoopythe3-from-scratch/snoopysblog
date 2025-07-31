import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import CreateArticle from "./createArticles";

import "./styles/index-revamp.css";
import "./styles/article.css";
// I added routing to make it easier
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/articles/create" element={<CreateArticle />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
