import React from 'react';

const TransportButtons = ({ type, loadStopsNames }) => {
  const images = {
    tram: [
      { src: '/static/images/tram_1.png', alt: 'Tramway 1', line: 'T1' },
      { src: '/static/images/tram_2.png', alt: 'Tramway 2', line: 'T2' },
      { src: '/static/images/tram_3a.png', alt: 'Tramway 3a', line: 'T3a' },
      { src: '/static/images/tram_3b.png', alt: 'Tramway 3b', line: 'T3b' },
      { src: '/static/images/tram_4.png', alt: 'Tramway 4', line: 'T4' },
      { src: '/static/images/tram_5.png', alt: 'Tramway 5', line: 'T5' },
      { src: '/static/images/tram_6.png', alt: 'Tramway 6', line: 'T6' },
      { src: '/static/images/tram_7.png', alt: 'Tramway 7', line: 'T7' },
      { src: '/static/images/tram_8.png', alt: 'Tramway 8', line: 'T8' },
      { src: '/static/images/tram_9.png', alt: 'Tramway 9', line: 'T9' },
      { src: '/static/images/tram_10.png', alt: 'Tramway 10', line: 'T10' },
      { src: '/static/images/tram_11.png', alt: 'Tramway 11', line: 'T11' },
      { src: '/static/images/tram_12.png', alt: 'Tramway 12', line: 'T12' },
      { src: '/static/images/tram_13.png', alt: 'Tramway 13', line: 'T13' },

    ],
    metro: [
      { src: '/static/images/metro_1.png', alt: 'Métro 1', line: '1' },
      { src: '/static/images/metro_2.png', alt: 'Métro 2', line: '2' },
      { src: '/static/images/metro_3.png', alt: 'Métro 3', line: '3' },
      { src: '/static/images/metro_4.png', alt: 'Métro 4', line: '4' },
      { src: '/static/images/metro_5.png', alt: 'Métro 5', line: '5' },
      { src: '/static/images/metro_6.png', alt: 'Métro 6', line: '6' },
      { src: '/static/images/metro_7.png', alt: 'Métro 7', line: '7' },
      { src: '/static/images/metro_8.png', alt: 'Métro 8', line: '8' },
      { src: '/static/images/metro_9.png', alt: 'Métro 9', line: '9' },
      { src: '/static/images/metro_10.png', alt: 'Métro 10', line: '10' },
      { src: '/static/images/metro_11.png', alt: 'Métro 11', line: '11' },
      { src: '/static/images/metro_12.png', alt: 'Métro 12', line: '12' },
      { src: '/static/images/metro_13.png', alt: 'Métro 13', line: '13' },
      { src: '/static/images/metro_14.png', alt: 'Métro 14', line: '14' },

    ],
    transilien: [
      { src: '/static/images/transilien_h.png', alt: 'Transilien H', line: 'H' },
      { src: '/static/images/transilien_j.png', alt: 'Transilien J', line: 'J' },
      { src: '/static/images/transilien_k.png', alt: 'Transilien K', line: 'K' },
      { src: '/static/images/transilien_l.png', alt: 'Transilien L', line: 'L' },
      { src: '/static/images/transilien_n.png', alt: 'Transilien N', line: 'N' },
      { src: '/static/images/transilien_p.png', alt: 'Transilien P', line: 'P' },
      { src: '/static/images/transilien_r.png', alt: 'Transilien R', line: 'R' },
    ],
    rer: [
      { src: '/static/images/rer_a.png', alt: 'RER A', line: 'A' },
      { src: '/static/images/rer_b.png', alt: 'RER B', line: 'B' },
      { src: '/static/images/rer_c.png', alt: 'RER C', line: 'C' },
      { src: '/static/images/rer_d.png', alt: 'RER D', line: 'D' },
      { src: '/static/images/rer_e.png', alt: 'RER E', line: 'E' },
    ]
  };

  return (
    <div id={`${type}-buttons`}>
      <img src={`/static/images/${type}.png`} alt={`${type.toUpperCase()} logo`} />
      {images[type].map((img, index) => (
        <img
          key={index}
          src={img.src}
          alt={img.alt}
          onClick={() => loadStopsNames(img.line, type)}
        />
      ))}
    </div>
  );
};

export default TransportButtons;
