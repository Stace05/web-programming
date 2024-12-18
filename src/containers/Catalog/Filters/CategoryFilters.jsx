
import React from 'react';
import './Filters.css'; 

const CategoryFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-options">
      <div className="filter-option">
        <input
          type="checkbox"
          id="cat"
          name="cat"
          checked={filters.cat}
          onChange={onFilterChange}
        />
        <label htmlFor="cat">Коти</label>
      </div>
      <div className="filter-option">
        <input
          type="checkbox"
          id="dog"
          name="dog"
          checked={filters.dog}
          onChange={onFilterChange}
        />
        <label htmlFor="dog">Собаки</label>
      </div>
      <div className="filter-option">
        <input
          type="checkbox"
          id="hamster"
          name="hamster"
          checked={filters.hamster}
          onChange={onFilterChange}
        />
        <label htmlFor="hamster">Хом'яки</label>
      </div>
    </div>
  );
};

export default CategoryFilters;
