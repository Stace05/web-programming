// src/pages/Home/HomeCards/HomeCards.js

import React, { useState } from 'react';
import CardItem from '../../../components/card_item/CardItem';
import cardsData from '../../../api/Cards.json';
import './HomeCards.css';
import images from '../../../components/image/images'; // Імпорт мапи зображень

function HomeCards() {
    const [visibleCards, setVisibleCards] = useState(3);

    const showMoreCards = () => {
        setVisibleCards(prev => prev + 6);
    };

    const hideCards = () => {
        setVisibleCards(3);
    };

    return (
        <div>
            <div className='home__cards'>
                {cardsData.slice(0, visibleCards).map((card) => {
                    const imageSrc = images[card.imgpath];
                    return (
                        <CardItem 
                            key={card.id} 
                            {...card} 
                            imageSrc={imageSrc} 
                        />
                    );
                })}
            </div>
            <div className='home__cards-button'>   
                {visibleCards < cardsData.length && (
                    <button onClick={showMoreCards}>Show More</button>
                )}
                {visibleCards > 3 && (
                    <button onClick={hideCards}>Show Less</button>
                )}
            </div>
        </div> 
    );
}

export default HomeCards;
