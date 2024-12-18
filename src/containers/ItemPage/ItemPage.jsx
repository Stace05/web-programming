// src/containers/ItemPage/ItemPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/axios.jsx';
import axios from 'axios';
import './ItemPage.css'; 
import { getImageSrc } from '../../components/card_item/CardItem.jsx'; 
import Loader from '../../components/Loader/Loader.jsx'; 
import { toast } from 'react-toastify';

function ItemPage() {
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [amount, setAmount] = useState(1);
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchCard = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/cards/${id}`);
                const cardData = response.data;
                cardData.imageSrc = getImageSrc(cardData.imgpath);
                setCard(cardData);
                
                if (cardData.stock.length > 0) {
                    setSelectedColor(cardData.stock[0].color);
                }
            } catch (err) {
                console.error('Error fetching card:', err);
                setError('Failed to load card');
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [id]);

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
        setAmount(1); 
    };

    const handleAddToCart = () => {
        if (card) {
            const stockItem = card.stock.find(stock => stock.color.toLowerCase() === selectedColor.toLowerCase());
            const stockAmount = stockItem ? stockItem.amount : 0;
            if (amount > stockAmount) {
                toast.error('Cannot add more items than available in stock');
                return;
            }

            const item = {
                id: Number(card.id), // Переконайтеся, що це число
                color: selectedColor,
                quantity: amount,
            };

            console.log('Dispatching addToCart with item:', item);

            dispatch(addToCart(item))
                .unwrap()
                .then(() => {
                    toast.success('Item added to cart');
                })
                .catch((error) => {
                    console.error('Error adding to cart:', error);
                    toast.error(error.error || 'Failed to add item to cart');
                });
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!card) {
        return <div className="error-message">Card not found</div>;
    }

    const stockAmount = card.stock.find(stock => stock.color.toLowerCase() === selectedColor.toLowerCase())?.amount || 0;

    return (
        <div>
            <div className='itempage__main'>
                <div className='main__info'>
                    <img src={card.imageSrc} alt={card.title} className="itempage-image" />
                    <div className='main__info__right'>
                        <article>
                            <h1>{card.title}</h1>
                            <p>{card.text}</p>
                        </article>
                        <h3>In stock: {stockAmount}</h3>
                        <div className="main__info-selects">
                            <div className="main__info-selects__count">
                                <p>Amount:</p>
                                <input
                                    type="number"
                                    min={stockAmount === 0 ? 0 : 1}
                                    max={stockAmount}
                                    className="content__cost-input"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                />
                            </div>
                            <div className="main__info-selects__color">
                                <p>Color:</p>
                                <select
                                    className="content__color-select"
                                    value={selectedColor}
                                    onChange={handleColorChange}
                                >
                                    {card.stock.map(stockItem => (
                                        <option key={stockItem.color} value={stockItem.color}>
                                            {stockItem.color.charAt(0).toUpperCase() + stockItem.color.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='main__price-buttons'>
                    <div className="main__price">
                        <p className="main__price-price">Price:</p>
                        <p>$ {card.price}</p>
                    </div>
                    <div className='buttons'>
                        <Link to='/catalog'> 
                            <button className='buttons_go_back'>Go back</button>
                        </Link>
                        <button className='buttons_add_to_cart' onClick={handleAddToCart}>
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemPage;
