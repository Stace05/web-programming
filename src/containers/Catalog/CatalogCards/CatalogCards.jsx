import React, { useState, useEffect } from 'react';
import cardsData from '../../../api/Cards.json';
import CardItem from '../../../components/card_item/CardItem';
import Filters from '../Filters/Filters';
import Search from '../Filters/Search/Search'; 
import images from '../../../components/image/images'; 

function CatalogCards() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState({
        cat: false,
        dog: false,
        hamster: false,
    });

    const [sortOrder, setSortOrder] = useState('none'); 

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
    };

    const filteredCards = cardsData
        .filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(card => {
            if (!filters.cat && !filters.dog && !filters.hamster) return true;
            if (filters.cat && card.category === 'cat') return true;
            if (filters.dog && card.category === 'dog') return true;
            if (filters.hamster && card.category === 'hamster') return true;
            return false;
        })
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.price - b.price;
            } else if (sortOrder === 'desc') {
                return b.price - a.price;
            } else {
                return 0; 
            }
        });

    return (
        <div>
            <div className="filters-search-container">
                <Search onSearch={handleSearch} />
                <Filters 
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />
            </div>

            <div className='home__cards'>
                {filteredCards.map((card) => {
                    const imageSrc = images[card.imgpath];

                    return (
                        <CardItem 
                            key={card.id} 
                            id={card.id}
                            title={card.title}
                            text={card.text}
                            price={card.price}
                            imageSrc={imageSrc} 
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CatalogCards;
