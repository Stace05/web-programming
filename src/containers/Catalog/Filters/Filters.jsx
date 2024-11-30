import React from 'react';
import './Filters.css';
import Search from './Search/Search.jsx';
import Select from './Select.jsx';
import SortOptions from './SortOptions.jsx'; // Додано імпорт SortOptions

function Filters({ 
    onSortByChange, 
    onSortOrderChange, 
    onSearch, 
    onCategoryChange, 
    sortBy, 
    sortOrder, 
    categories 
}) {

    const sortByOptions = [
        { value: "none", label: "None" },
        { value: "price", label: "Price" },
        { value: "title", label: "Title" },
    ];

    return (
        <div className="filters">
            <div className="filters__select">
                <Select 
                    label="Sort By:"
                    name="sortBy"
                    options={sortByOptions}
                    onChange={onSortByChange}
                    value={sortBy}
                />
                <SortOptions 
                    handleSortOrderChange={onSortOrderChange} // Передача обробника
                />
            </div>
            <Search onSearch={onSearch} />
            {/* Додано чекбокси для категорій */}
            <div className="filters__categories">
                <label>
                    <input 
                        type="checkbox" 
                        name="cat" 
                        checked={categories.cat} 
                        onChange={onCategoryChange} 
                    />
                    Cat
                </label>
                <label>
                    <input 
                        type="checkbox" 
                        name="dog" 
                        checked={categories.dog} 
                        onChange={onCategoryChange} 
                    />
                    Dog
                </label>
                <label>
                    <input 
                        type="checkbox" 
                        name="hamster" 
                        checked={categories.hamster} 
                        onChange={onCategoryChange} 
                    />
                    Hamster
                </label>
            </div>
        </div>
    );
}

export default Filters;
