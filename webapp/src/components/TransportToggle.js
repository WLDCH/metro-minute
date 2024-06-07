import React, { useState } from 'react';

const TransportToggle = ({ type, logo, buttons }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="transport-toggle">
      <button onClick={toggleOpen} className="transport-button">
        <img src={logo} alt={`${type} logo`} className="transport-logo" />
        <span>{type}</span>
      </button>
      <div className={`transport-buttons ${isOpen ? 'open' : ''}`}>
        {buttons.map((button, index) => (
          <img
            key={index}
            src={button.src}
            alt={button.alt}
            onClick={() => button.onClick()}
            className="line-button"
          />
        ))}
      </div>
    </div>
  );
};

export default TransportToggle;
