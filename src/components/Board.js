import React, { useImperativeHandle, forwardRef } from 'react';
import './Board.css';
import Tile from './Tile';

const Board = forwardRef((props, ref) => {
  const [score, setScore] = React.useState(0);
  const [grid, setGrid] = React.useState(() => {
    let empty = Array(16).fill(null);
    empty = spawnRandomTile(empty);
    empty = spawnRandomTile(empty);
    return empty;
  });

  function spawnRandomTile(grid) {
    const emptyIndices = grid.map((v, i) => v == null ? i : null).filter(i => i != null);
    if (emptyIndices.length === 0) return grid;
    const idx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    const newGrid = [...grid];
    newGrid[idx] = value;
    return newGrid;
  }

  useImperativeHandle(ref, () => ({
    handleMove: (direction) => {
      setGrid(prev => spawnRandomTile(prev));
      console.log('Board received move:', direction);
    }
  }), []);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', background: '#bbada0', color: '#fff', padding: '6px 18px', borderRadius: 8 }}>
          Score: {score}
        </span>
      </div>
      <div className="board">
        {grid.map((value, i) => <Tile key={i} value={value} />)}
      </div>
    </div>
  );
});

export default Board;
