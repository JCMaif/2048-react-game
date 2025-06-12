import React from 'react';
import './Tile.css';

function Tile({ value }) {
  return (
    <div className={`tile${value ? ` tile-${value}` : ''}`}>
      {value || ''}
    </div>
  );
}

export default Tile;
