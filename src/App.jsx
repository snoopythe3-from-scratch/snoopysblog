import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainContent from "./pages/MainContent";
import Footer from "./components/Footer";
import CreateArticle from "./pages/createArticles";
import About from "./pages/About";
import ArticlePage from "./pages/ArticlePage";
import LoginPage from "./pages/Login";
import Account from "./pages/Account";
import SignUpForm from "./pages/SignUp";

import "./styles/main.css";
import "./styles/about.css";
import "./styles/footer.css";
import "./styles/navbar.css";
import "./styles/article.css";
import "./styles/article-page.css";
import "./styles/article-modal.css";
import "./styles/categories.css";
import "./styles/editor.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/articles/create" element={<CreateArticle />} />
        <Route path="/about" element={<About />} />
        <Route path="/:category/article/:filename" element={<ArticlePage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
