import React from "react";
import "./Navigation.css";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

function Navigation() {
    const cartItems = useSelector(state => state.cart.items);
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="navigation">
            <ul>
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
            </ul>
        </nav>
    )
}

export default Navigation;
