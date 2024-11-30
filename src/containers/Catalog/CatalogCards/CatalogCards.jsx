import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardItem from '../../../components/card_item/CardItem.jsx';
import Filters from '../Filters/Filters.jsx';
import { getImageSrc } from '../../../components/card_item/CardItem.jsx'; 
import Loader from '../../../components/Loader/Loader.jsx';

function CatalogCards() {

    const [cards, setCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('none'); // Замість sortFeat
    const [sortOrder, setSortOrder] = useState('descending');
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState({
        cat: false,
        dog: false,
        hamster: false
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            try {
                const params = {
                    searchTerm,
                    sortBy,
                    sortOrder,
                    cat: categories.cat,
                    dog: categories.dog,
                    hamster: categories.hamster
                };
                console.log('Запит з параметрами:', params); // Додано логування
                const response = await axios.get('/api/cards-catalog', { params });
                setCards(response.data);
            } catch (error) {
                console.error('Error fetching cards:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();

    }, [searchTerm, sortBy, sortOrder, categories]); // Додаємо sortBy в залежності

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortByChange = (event) => { // Замість handleSortFeatChange
        setSortBy(event.target.value);
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    const handleCategoryChange = (e) => {
        const { name, checked } = e.target;
        setCategories(prev => ({ ...prev, [name]: checked }));
    };

    return (
        <div>
            <Filters 
                onSortByChange={handleSortByChange} // Замість onSortFeatChange
                onSortOrderChange={handleSortOrderChange}
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                sortBy={sortBy} // Додано
                sortOrder={sortOrder} // Додано
                categories={categories}
            />
            {loading && <Loader />}
            {!loading && (
                <div className='home__cards'>
                    {cards.map((card, index) => {
                        const imageSrc = getImageSrc(card.imgpath);
                        return (
                            <CardItem 
                                key={card.id} 
                                {...card} 
                                index={index} 
                                imageSrc={imageSrc} 
                                showViewMore={true} // Додано пропс
                                showPrice={true}    // Додано пропс, якщо потрібно відображати ціну
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default CatalogCards;
