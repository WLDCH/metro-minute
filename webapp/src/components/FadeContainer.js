import React, { useState, useEffect } from 'react';

const FadeContainer = ({ isVisible, children, onFadeOutEnd, duration = 500 }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isVisible) {
      setIsFading(true);
      timeoutId = setTimeout(() => {
        setShouldRender(true);
        setIsFading(false);
      }, duration); // Correspond à la durée de l'animation de fondu
    } else {
      setIsFading(true);
      timeoutId = setTimeout(() => {
        setShouldRender(false);
        setIsFading(false);
        onFadeOutEnd();
      }, duration); // Correspond à la durée de l'animation de fondu
    }
    return () => clearTimeout(timeoutId);
  }, [isVisible, onFadeOutEnd, duration]);

  return shouldRender || isFading ? (
    <div className={`fade-container ${isVisible ? 'fade-in' : 'fade-out'}`} style={{ transitionDuration: `${duration}ms` }}>
      {children}
    </div>
  ) : null;
};

export default FadeContainer;
