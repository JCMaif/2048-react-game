import React, { useCallback, useEffect, useRef } from 'react';
import './Game.css';
import Board from './Board';

function Game() {
  const boardRef = useRef();

  const handleInput = useCallback((event) => {
    let direction = null;
    if (event.type === 'keydown') {
      switch (event.key) {
        case 'ArrowUp':
        case 'z':
        case 'Z':
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'q':
        case 'Q':
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'right';
          break;
        default:
          break;
      }
    } else if (event.type === 'touchend' && event.swipeDirection) {
      direction = event.swipeDirection;
    }
    if (direction) {
      // Notify Board of the move
      if (boardRef.current && boardRef.current.handleMove) {
        boardRef.current.handleMove(direction);
      } else {
        console.log('Ignored Move:', direction);
      }
    }
  }, [boardRef]);

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleInput);
    return () => window.removeEventListener('keydown', handleInput);
  }, [handleInput]);

  // Touch/swipe event listeners
  useEffect(() => {
    let startX = 0, startY = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };
    const handleTouchEnd = (e) => {
      if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
          let swipeDirection = null;
          if (Math.abs(dx) > Math.abs(dy)) {
            swipeDirection = dx > 0 ? 'right' : 'left';
          } else {
            swipeDirection = dy > 0 ? 'down' : 'up';
          }
          handleInput({ type: 'touchend', swipeDirection });
        }
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleInput]);

  return (
    <div className="game-container">
      <h1>2048</h1>
      <Board ref={boardRef} />
    </div>
  );
}

export default Game;
