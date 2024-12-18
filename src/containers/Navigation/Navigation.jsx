import React from "react";
import "./Navigation.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

function Navigation() {
    const navigate = useNavigate();
    const cartItems = useSelector(state => state.cart.items);
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const userEmail = localStorage.getItem('userEmail');

    const handleSignOut = () => {
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    return (
        <nav className="navigation">
            <ul>
                {userEmail ? (
                    <>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/catalog">Catalog</Link></li>
                        <li>
                            <Link to="/cart">
                                Cart
                                {totalQuantity > 0 && (
                                    <span className="cart-count">{totalQuantity}</span>
                                )}
                            </Link>
                        </li>
                        <li><button onClick={handleSignOut} className="sign-out-button">Sign Out</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navigation;
