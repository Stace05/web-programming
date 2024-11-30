import React, { useEffect, useState } from "react";
import Hero from "./Hero/Hero.jsx";
import HomeCards from "./HomeCards/HomeCards.jsx";
import DocumentTitle from "../../components/helmet/document_title.jsx";
import axios from "axios";

function Home() {
  DocumentTitle("Home");

  const [data, setData] = useState('');

  useEffect(() => {
    axios.get('/api/data')
      .then((response) => {
        setData(response.data.message); 
      })
      .catch((error) => {
        console.error('Помилка отримання даних:', error);
      });
  }, []);

  return (
    <div>
      <Hero />
      <HomeCards />
    </div>
  );
}

export default Home;