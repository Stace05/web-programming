import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart } from '../../Redux/axios.jsx'; 
import './Cart.css';
import { getImageSrc } from '../../components/card_item/CardItem.jsx';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.items);
    const cartStatus = useSelector(state => state.cart.status);
    const error = useSelector(state => state.cart.error);

    const [products, setProducts] = useState({});
    const [loadingProducts, setLoadingProducts] = useState(false);

    useEffect(() => {
        if (cartStatus === 'idle') {
            dispatch(fetchCart());
        }
    }, [cartStatus, dispatch]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (cartStatus !== 'succeeded' || cart.length === 0) {
                setProducts({});
                return;
            }

            setLoadingProducts(true);
            try {
                const uniqueItemIds = [...new Set(cart.map(item => item.item_id))];
                const fetchPromises = uniqueItemIds.map(id => fetch(`/api/cards/${id}`).then(res => res.json()));
                const responses = await Promise.all(fetchPromises);
                const productsData = {};
                responses.forEach(product => {
                    productsData[product.id] = product;
                });
                setProducts(productsData);
            } catch (err) {
                console.error('Error fetching product details:', err);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [cart, cartStatus]);

    const handleQuantityChange = (cartItemId, color, quantity) => {
        if (quantity < 1) return;
        dispatch(updateCartItem({ cartItemId, color, quantity }))
            .unwrap()
            .then(() => {
                toast.success('Cart updated successfully');
            })
            .catch((error) => {
                console.error('Error updating cart:', error);
                toast.error(error.error || 'Failed to update cart');
            });
    };

    const handleRemove = (cartItemId, color) => {
        console.log(`Removing item with ID: ${cartItemId}, color: ${color}`);
        dispatch(removeFromCart({ cartItemId, color }))
            .unwrap()
            .then(() => {
                toast.success('Item removed from cart');
            })
            .catch((error) => {
                console.error('Error removing item from cart:', error);
                toast.error(error.error || 'Failed to remove item from cart');
            });
    };

    let content;

    if (cartStatus === 'loading') {
        content = <div>Loading...</div>;
    } else if (cartStatus === 'succeeded') {
        if (cart.length === 0) {
            content = <div>Your cart is empty.</div>;
        } else if (loadingProducts) {
            content = <div>Loading products...</div>;
        } else {
            content = (
                <div className="cart-container">
                    {cart.map(item => {
                        const product = products[item.item_id];
                        if (!product) {
                            return (
                                <div key={`${item.id}-${item.color}`} className="cart-item">
                                    <div className="cart-item-details">
                                        <h3>Product not found</h3>
                                        <p>Color: {item.color.charAt(0).toUpperCase() + item.color.slice(1)}</p>
                                        <p>Price: ${item.price}</p>
                                        <div className="cart-item-quantity">
                                            <label htmlFor={`quantity-${item.id}-${item.color}`}>Quantity:</label>
                                            <input
                                                type="number"
                                                id={`quantity-${item.id}-${item.color}`}
                                                min="1"
                                                max={1}
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, item.color, Number(e.target.value))}
                                            />
                                        </div>
                                        <button onClick={() => handleRemove(item.id, item.color)} className="cart-item-remove">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={`${item.id}-${item.color}`} className="cart-item">
                                <img src={getImageSrc(product.imgpath)} alt={product.title} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3>{product.title}</h3>
                                    <p>{product.text}</p>
                                    <p>Color: {item.color.charAt(0).toUpperCase() + item.color.slice(1)}</p>
                                    <p>Price: ${product.price}</p>
                                    <div className="cart-item-quantity">
                                        <label htmlFor={`quantity-${item.id}-${item.color}`}>Quantity:</label>
                                        <input
                                            type="number"
                                            id={`quantity-${item.id}-${item.color}`}
                                            min="1"
                                            max={product.stock.find(s => s.color.toLowerCase() === item.color.toLowerCase())?.amount || 1}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, item.color, Number(e.target.value))}
                                        />
                                    </div>
                                    <button onClick={() => handleRemove(item.id, item.color)} className="cart-item-remove">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    <div className="cart-actions">
                        {/* Видалено кнопку Clear Cart */}
                        <button>
                            <Link to="/form">Check out</Link>
                        </button>
                    </div>
                </div>
            );
        }
    } else if (cartStatus === 'failed') {
        content = <div>{error}</div>;
    }

    return (
        <div className="cart-page">
            <h2>Your Cart</h2>
            {content}
        </div>
    );
}

export default Cart;
