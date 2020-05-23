import { useState } from 'react';
import store from '../lib/localStore';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const item = store.getItem(key);
    try {
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return item || initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      store.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = () => {
    try {
      store.removeItem(key);
    } catch (e) {
      console.log(e);
    }
  };

  return [storedValue, setValue, removeItem];
};
