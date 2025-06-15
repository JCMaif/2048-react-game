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

  function moveTiles(grid, direction) {
    let newGrid = [...grid];
    let hasMoved = false;

    const moveAndMerge = (line) => {
      const filteredLine = line.filter(val => val !== null);
      let mergedLine = [];
      let i = 0;

      while (i < filteredLine.length) {
        if (i + 1 < filteredLine.length && filteredLine[i] === filteredLine[i + 1]) {
          mergedLine.push(filteredLine[i] * 2);
          setScore(prevScore => prevScore + filteredLine[i] * 2);
          i += 2;
        } else {
          mergedLine.push(filteredLine[i]);
          i += 1;
        }
      }

      while (mergedLine.length < 4) {
        mergedLine.push(null);
      }

      return mergedLine;
    };

    if (direction === 'left' || direction === 'right') {
      for (let row = 0; row < 4; row++) {
        let line = newGrid.slice(row * 4, row * 4 + 4);
        if (direction === 'right') {
          line.reverse();
        }
        const newLine = moveAndMerge(line);
        if (direction === 'right') {
          newLine.reverse();
        }
        newGrid.splice(row * 4, 4, ...newLine);
      }
    } else if (direction === 'up' || direction === 'down') {
      for (let col = 0; col < 4; col++) {
        let line = [newGrid[col], newGrid[col + 4], newGrid[col + 8], newGrid[col + 12]];
        if (direction === 'down') {
          line.reverse();
        }
        const newLine = moveAndMerge(line);
        if (direction === 'down') {
          newLine.reverse();
        }
        for (let row = 0; row < 4; row++) {
          newGrid[row * 4 + col] = newLine[row];
        }
      }
    }

    if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
      hasMoved = true;
    }

    return { newGrid, hasMoved };
  }


  useImperativeHandle(ref, () => ({
    handleMove: (direction) => {
      setGrid(prevGrid => {
        const { newGrid, hasMoved } = moveTiles(prevGrid, direction);
        if (hasMoved) {
          const updatedGrid = spawnRandomTile(newGrid);
          return updatedGrid;
        }
        return prevGrid;
      });
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
