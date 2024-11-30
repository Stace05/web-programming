
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchCart } from './Redux/CartSlice.jsx';
import Header from "./containers/Header/Header.jsx";
import Footer from "./containers/Footer/Footer.jsx";
import Home from "./containers/Home/Home.jsx";
import Catalog from "./containers/Catalog/Catalog.jsx";
import ItemPage from "./containers/ItemPage/ItemPage.jsx";
import Cart from "./containers/Cart/Cart.jsx";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ItemPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer /> {}
    </Router>
  );
}

export default App;
