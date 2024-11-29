import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import cardsData from '../../api/Cards.json';
import DocumentTitle from '../../components/helmet/document_title';
import images from '../../components/image/images'; 
import './ItemPage.css';

function ItemPage() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    DocumentTitle("Catalog");

    const { id } = useParams();
    console.log('URL id:', id); 

    const cardId = Number(id);
    console.log('Parsed cardId:', cardId); 

    const card = cardsData.find(card => card.id === cardId);
    console.log('Found card:', card); 

    if (!card) {
        return <div>Card not found</div>;
    }

    const imageSrc = images[card.imgpath];
    console.log('Image Source:', imageSrc); 

    return (
        <div className='itempage__main'>
            <div className='main__info'>
                {imageSrc ? (
                    <img src={imageSrc} alt={card.title} />
                ) : (
                    <div className="image-placeholder">Image not available</div>
                )}
                <article>
                    <h1>{card.title}</h1>
                    <p>{card.text}</p>
                </article>
            </div>
            <div className='main__price-buttons'>
                <div className="main__price">
                    <p className="main__price-price">Price:</p>
                    <p>{card.price} $</p>
                </div> 
                <div className='buttons'>
                    <Link to='/catalog'> 
                        <button className='buttons_go_back'>Back To Catalog</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ItemPage;
