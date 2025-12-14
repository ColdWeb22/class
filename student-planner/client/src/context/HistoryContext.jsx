import React, { createContext, useContext, useState, useCallback } from 'react';

const HistoryContext = createContext();

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const pushState = useCallback((state) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push({ ...state, timestamp: Date.now() });
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const clear = () => {
    setHistory([]);
    setCurrentIndex(-1);
  };

  const value = {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    currentState: history[currentIndex] || null,
  };

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}
