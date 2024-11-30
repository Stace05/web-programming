import React from "react";
import "./Hero.css";
import headerPhoto from "../../../components/image/pets.jpg";

function Hero() {
    return (
        <div className="hero">   
            <img className="hero-photo" src={headerPhoto}/>
            <article>
                <h1>
                    Pet Shop
                </h1>
                <p>
                Welcome to our pet shop, where we have a wonderful selection of dogs, cats, and hamsters ready to find their forever homes! 
                Whether you're looking for a loyal canine companion, a playful kitten, or an adorable hamster, our knowledgeable team is here to help you find the perfect pet.  
                Visit us today to meet your new best friend and explore our wide range of pet care products to keep them happy and healthy!
                </p>
            </article>
        </div>
    )
}

export default Hero;