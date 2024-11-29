import React from 'react';
import { Link } from 'react-router-dom';
import './CardItem.css'; 

const CardItem = ({ id, title, text, imageSrc, price }) => {
  console.log('Rendering CardItem with id:', id); 

  return (
    <div className="card-item">
      <Link to={`/catalog/${id}`}>
        <img src={imageSrc} alt={title} className="card-image" />
      </Link>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{text}</p>
        <p className="card-price">${price}</p>
        <Link to={`/catalog/${id}`}>
          <button className="card-button">View More</button>
        </Link>
      </div>
    </div>
  );
};

export default CardItem;
