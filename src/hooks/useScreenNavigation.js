import { useState, useCallback, useRef } from 'react';

export function useScreenNavigation(initialScreen = 'landing') {
  const [screen, setScreen] = useState(initialScreen);
  const mainRef = useRef(null);

  const navigateTo = useCallback((targetScreen) => {
    window.scrollTo(0, 0);
    setScreen(targetScreen);
    // Move focus to the top of the page content for keyboard/screen-reader users
    setTimeout(() => {
      if (mainRef.current) {
        const heading = mainRef.current.querySelector('h1, h2, [data-screen-focus]');
        if (heading) heading.focus({ preventScroll: true });
      }
    }, 100);
  }, []);

  return { screen, navigateTo, mainRef };
}
