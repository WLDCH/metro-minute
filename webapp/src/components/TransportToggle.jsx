import React, { useState } from 'react';
import getTransportButtons from './TransportButtons';

const TransportToggle = ({ type, logo, onClickHandler }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Utilisez les boutons du fichier TransportButtons
  const buttons = getTransportButtons(onClickHandler)[type.toLowerCase()] || [];

  return (
    <div style={{ margin: '10px 0', textAlign: 'center' }}>
      <button onClick={toggleOpen} style={transportButtonStyle}>
        <img src={logo} alt={`${type} logo`} style={{ marginRight: '10px', width: '30px', height: '30px' }} />
        <span>{type}</span>
      </button>
      <div style={{ ...transportButtonsStyle, ...(isOpen ? openStyle : closedStyle) }}>
        {buttons.map((button, index) => (
          <img
            key={index}
            src={button.src}
            alt={button.alt}
            onClick={button.onClick}
            style={{ margin: '5px', cursor: 'pointer', width: '30px', height: '30px' }}
          />
        ))}
      </div>
    </div>
  );
};

const transportButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f0f0f0',
  border: 'none',
  padding: '10px',
  cursor: 'pointer',
  color: '#003366',
  fontWeight: 'bold',
  fontSize: '1.2em',
  borderRadius: '8px',
  width: '800px',
  transition: 'background-color 0.3s',
};

const transportButtonsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '10px',
  overflow: 'hidden',
  maxHeight: '0',
  transition: 'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out',
  opacity: '0',
};

const openStyle = {
  maxHeight: '200px',
  opacity: '1',
};

const closedStyle = {
  maxHeight: '0',
  opacity: '0',
};

export default TransportToggle;
