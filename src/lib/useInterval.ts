import { useEffect, useRef } from 'react';

export const useInterval = (callback, delay) => {
  const savedCallback: any = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};
