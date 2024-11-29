
import React, { useState } from 'react';
import './Filters.css'; 
import Select from './Select'; 
import CategoryFilters from './CategoryFilters'; 

const Filters = ({ onFilterChange, onSortChange }) => {
  const [filters, setFilters] = useState({
    cat: false,
    dog: false,
    hamster: false,
  });

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    const newFilters = { ...filters, [name]: checked };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value) => {
    onSortChange(value);
  };


  const sortOptions = [
    { value: "none", label: "Без сортування", disabled: true },
    { value: "asc", label: "Ціна: Від низької до високої" },
    { value: "desc", label: "Ціна: Від високої до низької" },
  ];

  return (
    <div className="filters-container">
      <h2>Категорія</h2>
      <CategoryFilters filters={filters} onFilterChange={handleFilterChange} />
      <h2>Сортувати за ціною</h2>
      <div className="sort-options">
        <Select 
          label="" 
          name="sort"
          options={sortOptions}
          onChange={(e) => handleSortChange(e.target.value)}
          defaultValue="none"
        />
      </div>
    </div>
  );
};

export default Filters;
