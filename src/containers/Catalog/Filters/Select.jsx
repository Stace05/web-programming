import React from 'react';

function Select({ label, name, options, onChange, value }) { // Додано `value`
    return (
        <div className="select">
            <label htmlFor={name}>{label}</label>
            <select id={name} name={name} onChange={onChange} value={value}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;
