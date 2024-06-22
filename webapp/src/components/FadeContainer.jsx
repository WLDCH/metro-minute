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
      }, duration);
    } else {
      setIsFading(true);
      timeoutId = setTimeout(() => {
        setShouldRender(false);
        setIsFading(false);
        onFadeOutEnd();
      }, duration);
    }
    return () => clearTimeout(timeoutId);
  }, [isVisible, onFadeOutEnd, duration]);

  return shouldRender || isFading ? (
    <div style={{ transitionDuration: `${duration}ms`, transitionProperty: 'opacity', opacity: isVisible ? '1' : '0' }}>
      {children}
    </div>
  ) : null;
};

export default FadeContainer;
