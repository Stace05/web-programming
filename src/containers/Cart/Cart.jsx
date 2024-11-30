import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart } from '../../Redux/CartSlice.jsx';
import './Cart.css';
import { getImageSrc } from '../../components/card_item/CardItem.jsx';
import { toast } from 'react-toastify';

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);
  const cartStatus = useSelector(state => state.cart.status);
  const error = useSelector(state => state.cart.error);

  useEffect(() => {
    if (cartStatus === 'idle') {
      dispatch(fetchCart());
    }
  }, [cartStatus, dispatch]);

  const handleQuantityChange = (id, color, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ id, color, quantity }))
      .unwrap()
      .then(() => {
        toast.success('Cart updated successfully');
      })
      .catch((error) => {
        console.error('Error updating cart:', error);
        toast.error(error.error || 'Failed to update cart');
      });
  };

  const handleRemove = (id, color) => {
    console.log(`Видаляємо товар з ID: ${id}, кольором: ${color}`);
    dispatch(removeFromCart({ id, color }))
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
    } else {
      content = (
        <div className="cart-container">
          {cart.map(item => (
            <div key={`${item.id}-${item.color}`} className="cart-item">
              <img src={getImageSrc(item.imgpath)} alt={item.title} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <p>Color: {item.color.charAt(0).toUpperCase() + item.color.slice(1)}</p>
                <p>Price: ${item.price}</p>
                <div className="cart-item-quantity">
                  <label htmlFor={`quantity-${item.id}-${item.color}`}>Quantity:</label>
                  <input
                    type="number"
                    id={`quantity-${item.id}-${item.color}`}
                    min="1"
                    max={item.stock.find(s => s.color === item.color)?.amount || 1}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, item.color, Number(e.target.value))}
                  />
                </div>
                <button onClick={() => handleRemove(item.id, item.color)} className="cart-item-remove">
                  Remove
                </button>
              </div>
            </div>
          ))}
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
