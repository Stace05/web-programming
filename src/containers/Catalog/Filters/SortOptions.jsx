import React from "react";
import Select from './Select';
import './Filters.css';

function SortOptions({ handleSortChange }) {
    const sortOptions = [
        { value: "none", label: "Без сортування", disabled: true },
        { value: "asc", label: "Ціна: Від низької до високої" },
        { value: "desc", label: "Ціна: Від високої до низької" },
    ];

    return (
        <div className="sort-options">
            <Select 
                label="Сортування" 
                name="sort" 
                options={sortOptions} 
                onChange={handleSortChange} 
                defaultValue="none"
            />
        </div>
    );
}

export default SortOptions;
