import React from "react";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";

// I tested out adding all three css files and it gives the same results as just having this one, so i deleted the other ones
import "./styles/index-revamp.css"
// css just for articles
import "./styles/article.css"

function App() {
  return (
    <>
    <Header />
    <MainContent />
    <Footer />
    </>
  )
}

export default App
