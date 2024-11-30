import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './ItemPage.css';
import { getImageSrc } from '../../components/card_item/CardItem.jsx';
import Loader from '../../components/Loader/Loader.jsx';

function ItemPage() {
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/cards/${id}`)
            .then(response => {
                const cardData = response.data;
                cardData.imageSrc = getImageSrc(cardData.imgpath);
                setCard(cardData);
            })
            .catch(error => {
                console.error('Error fetching card:', error);
                setError('Failed to load card');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);


    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!card) {
        return <div>Card not found</div>;
    }

    return (
        <div>
            <div className='itempage__main'>
                <div className='main__info'>
                    <img src={card.imageSrc} alt={card.title} />
                    <article>
                        <h1>{card.title}</h1>
                        <p>{card.text}</p>
                    </article>
                </div>
                <div className='main__price-buttons'>
                    <div className="main__price">
                        <p className="main__price-price">Price:</p>
                        <p>$ {card.price}</p>
                    </div> 
                    <div className='buttons'>
                        <Link to='/catalog'> 
                            <button className='buttons_go_back'>Back To Catalog</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default ItemPage;