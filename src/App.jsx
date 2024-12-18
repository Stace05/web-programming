import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchCart } from './Redux/axios.jsx';
import Footer from "./containers/Footer/Footer.jsx";
import Header from "./containers/Header/Header.jsx";
import Home from "./containers/Home/Home.jsx";
import Catalog from "./containers/Catalog/Catalog.jsx";
import ItemPage from "./containers/ItemPage/ItemPage.jsx";
import Cart from "./containers/Cart/Cart.jsx";
import MyForm from "./components/MyForm.jsx";
import SuccessPage from "./components/SuccessPage.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* Публічні маршрути */}
          <Route
            path="/login"
            element={
              !userEmail ? <Login /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/register"
            element={
              !userEmail ? <Register /> : <Navigate to="/" replace />
            }
          />

          {/* Захищені маршрути */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalog"
            element={
              <ProtectedRoute>
                <Catalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalog/:id"
            element={
              <ProtectedRoute>
                <ItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <MyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />

          {/* Перенаправлення за замовчуванням */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;
