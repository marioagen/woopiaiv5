import { useEffect, useRef } from 'react';

export interface KeyboardShortcutHandlers {
  onSearchFocus?: () => void;
  onAddButtonClick?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const handlersRef = useRef(handlers);
  
  // Update handlers ref when they change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Alt+B (Search focus)
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        event.stopPropagation();
        if (handlersRef.current.onSearchFocus) {
          handlersRef.current.onSearchFocus();
        }
      }
      
      // Check for Ctrl+Alt+N (Add button click)
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        event.stopPropagation();
        if (handlersRef.current.onAddButtonClick) {
          handlersRef.current.onAddButtonClick();
        }
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}