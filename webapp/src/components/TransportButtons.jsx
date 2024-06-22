// TransportButtons.jsx
const getTransportButtons = (onClickHandler) => ({
  metro: [
    { src: '/static/images/metro_1.png', alt: 'Métro 1', onClick: () => onClickHandler('1', 'metro') },
    { src: '/static/images/metro_2.png', alt: 'Métro 2', onClick: () => onClickHandler('2', 'metro') },
    { src: '/static/images/metro_3.png', alt: 'Métro 3', onClick: () => onClickHandler('3', 'metro') },
    { src: '/static/images/metro_4.png', alt: 'Métro 4', onClick: () => onClickHandler('4', 'metro') },
    { src: '/static/images/metro_5.png', alt: 'Métro 5', onClick: () => onClickHandler('5', 'metro') },
    { src: '/static/images/metro_6.png', alt: 'Métro 6', onClick: () => onClickHandler('6', 'metro') },
    { src: '/static/images/metro_7.png', alt: 'Métro 7', onClick: () => onClickHandler('7', 'metro') },
    { src: '/static/images/metro_8.png', alt: 'Métro 8', onClick: () => onClickHandler('8', 'metro') },
    { src: '/static/images/metro_9.png', alt: 'Métro 9', onClick: () => onClickHandler('9', 'metro') },
    { src: '/static/images/metro_10.png', alt: 'Métro 10', onClick: () => onClickHandler('10', 'metro') },
    { src: '/static/images/metro_11.png', alt: 'Métro 11', onClick: () => onClickHandler('11', 'metro') },
    { src: '/static/images/metro_12.png', alt: 'Métro 12', onClick: () => onClickHandler('12', 'metro') },
    { src: '/static/images/metro_13.png', alt: 'Métro 13', onClick: () => onClickHandler('13', 'metro') },
    { src: '/static/images/metro_14.png', alt: 'Métro 14', onClick: () => onClickHandler('14', 'metro') },

  ],
  tramway: [
    { src: '/static/images/tram_1.png', alt: 'Tramway 1', onClick: () => onClickHandler('T1', 'tram') },
    { src: '/static/images/tram_2.png', alt: 'Tramway 2', onClick: () => onClickHandler('T2', 'tram') },
    { src: '/static/images/tram_3a.png', alt: 'Tramway 3a', onClick: () => onClickHandler('T3a', 'tram') },
    { src: '/static/images/tram_3b.png', alt: 'Tramway 3b', onClick: () => onClickHandler('T3b', 'tram') },
    { src: '/static/images/tram_4.png', alt: 'Tramway 4', onClick: () => onClickHandler('T4', 'tram') },
    { src: '/static/images/tram_5.png', alt: 'Tramway 5', onClick: () => onClickHandler('T5', 'tram') },
    { src: '/static/images/tram_6.png', alt: 'Tramway 6', onClick: () => onClickHandler('T6', 'tram') },
    { src: '/static/images/tram_7.png', alt: 'Tramway 7', onClick: () => onClickHandler('T7', 'tram') },
    { src: '/static/images/tram_8.png', alt: 'Tramway 8', onClick: () => onClickHandler('T8', 'tram') },
    { src: '/static/images/tram_9.png', alt: 'Tramway 9', onClick: () => onClickHandler('T9', 'tram') },
    { src: '/static/images/tram_10.png', alt: 'Tramway 10', onClick: () => onClickHandler('T10', 'tram') },
    { src: '/static/images/tram_11.png', alt: 'Tramway 11', onClick: () => onClickHandler('T11', 'tram') },
    { src: '/static/images/tram_12.png', alt: 'Tramway 12', onClick: () => onClickHandler('T12', 'tram') },
    { src: '/static/images/tram_13.png', alt: 'Tramway 13', onClick: () => onClickHandler('T13', 'tram') },

  ],
  transilien: [
    { src: '/static/images/transilien_h.png', alt: 'Transilien H', onClick: () => onClickHandler('H', 'transilien') },
    { src: '/static/images/transilien_j.png', alt: 'Transilien J', onClick: () => onClickHandler('J', 'transilien') },
    { src: '/static/images/transilien_k.png', alt: 'Transilien K', onClick: () => onClickHandler('K', 'transilien') },
    { src: '/static/images/transilien_l.png', alt: 'Transilien L', onClick: () => onClickHandler('L', 'transilien') },
    { src: '/static/images/transilien_n.png', alt: 'Transilien N', onClick: () => onClickHandler('N', 'transilien') },
    { src: '/static/images/transilien_p.png', alt: 'Transilien P', onClick: () => onClickHandler('P', 'transilien') },
    { src: '/static/images/transilien_r.png', alt: 'Transilien R', onClick: () => onClickHandler('R', 'transilien') },
  ],
  rer: [
    { src: '/static/images/rer_a.png', alt: 'RER A', onClick: () => onClickHandler('A', 'rer') },
    { src: '/static/images/rer_b.png', alt: 'RER B', onClick: () => onClickHandler('B', 'rer') },
    { src: '/static/images/rer_c.png', alt: 'RER C', onClick: () => onClickHandler('C', 'rer') },
    { src: '/static/images/rer_d.png', alt: 'RER D', onClick: () => onClickHandler('D', 'rer') },
    { src: '/static/images/rer_e.png', alt: 'RER E', onClick: () => onClickHandler('E', 'rer') },
  ],
});

export default getTransportButtons;
