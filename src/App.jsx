import React, { useEffect, useState } from "react";
import axios from 'axios';
import Header from "./containers/Header/Header.jsx";
import Footer from "./containers/Footer/Footer.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./containers/Home/Home.jsx";
import Catalog from "./containers/Catalog/Catalog.jsx";
import ItemPage from "./containers/ItemPage/ItemPage.jsx";

function App() {

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ItemPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;