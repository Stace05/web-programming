import React from "react";
import Select from './Select.jsx';
import './Filters.css';

function SortOptions({ handleSortOrderChange }) { // Змінено пропс на handleSortOrderChange
    const sortOrderOptions = [
        { value: "none", label: "Без сортування", disabled: true },
        { value: "ascending", label: "За зростанням" },
        { value: "descending", label: "За спаданням" },
    ];

    return (
        <div className="sort-options">
            <Select 
                label="Сортування" 
                name="sortOrder" // Змінено name на sortOrder
                options={sortOrderOptions} 
                onChange={handleSortOrderChange} 
                value="none" // Використання контрольованого компонента
            />
        </div>
    );
}

export default SortOptions;
