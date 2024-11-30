import React from "react";
import './CardItem.css';
import { Link } from 'react-router-dom';
import Bengal from '../image/bengal.jpg';
import German from '../image/german.jpg';
import Chinese from '../image/chinese.jpg';
import Syrian from '../image/syrian.jpg';
import Maine_Coon from '../image/maine_coon.jpg';
import Terrier from '../image/terrier.jpg';
import Persian from '../image/persian.jpg';
import British from '../image/british.jpg';

export function getImageSrc(imgpath) {
    switch (imgpath) {
        case 'Bengal':
            return Bengal;
        case 'German':
            return German;
        case 'Chinese':
            return Chinese;
        case 'Syrian':
            return Syrian;
        case 'Maine_Coon':
            return Maine_Coon;
        case 'Terrier':
            return Terrier;
        case 'Persian':
            return Persian;
        case 'British':
            return British;
        default:
            return null; // або дефолтне зображення
    }
}

function CardItem({ id, title, text, imgpath, price, showViewMore, showPrice }) {
    const imageSrc = getImageSrc(imgpath);
  
    console.log(`CardItem - showViewMore: ${showViewMore}, id: ${id}`);
  
    return (
      <div className="cards_content">
        <div className="cards__photo-container">
            {imageSrc ? (
                <img src={imageSrc} alt={title} className="cards__photo" />
            ) : (
                <div className="cards__photo-placeholder">No Image Available</div>
            )}
        </div>
        <article>
          <h3 className="cards_title">{title}</h3>
          <p className="cards_desc">{text}</p>
          {showPrice && (
            <div className="cards_price">
              <p className="cards_price-price">Price:</p>
              <p>{price} $</p>
            </div>
          )}
        </article>
        {showViewMore && (
          <div className="cards__button-container">
            <Link to={`/catalog/${id}`}>
              <button className="cards__button">View More</button>
            </Link>
          </div>
        )}
      </div>
    );
}

export default CardItem;
