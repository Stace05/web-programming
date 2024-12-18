import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './Redux/Store.jsx'; 
import App from './App.jsx';
import './index.css'; 

const container = document.getElementById('root');
const root = createRoot(container);

console.log('Redux store in index.js:', store); 

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
