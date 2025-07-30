import React from 'react';
import './Loader.css';

const Loader = () => (
  <div className="loader-overlay">
    <div className="spinner-wrapper">
      <div className="spinner-circle"></div>
      <div className="spinner-logo-wrapper">
        <img src="/niramay-logo.jpg" alt="Logo" />
      </div>
    </div>
  </div>
);

export default Loader;
