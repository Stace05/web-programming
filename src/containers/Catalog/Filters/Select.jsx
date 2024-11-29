
import React from "react";
import './Filters.css';

function Select({ label, name, options, onChange, defaultValue }) {
    return (
        <div className="selects">
            {label && <label htmlFor={name}>{label}</label>}
            <select 
                name={name} 
                id={name} 
                onChange={onChange} 
                defaultValue={defaultValue}
            >
                {options.map(option => (
                    <option 
                        key={option.value} 
                        value={option.value} 
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;
