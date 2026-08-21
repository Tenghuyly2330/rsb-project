import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
      const [theme, setTheme] = useState(() => {
            return localStorage.getItem('theme') || 'light';
      });

      useEffect(() => {
            localStorage.setItem('theme', theme);
            if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.body.classList.add('dark-mode');
            } else {
                  document.documentElement.classList.remove('dark');
                  document.body.classList.remove('dark-mode');
            }
      }, [theme]);

      const toggleTheme = () => {
            setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
      };

      return (
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                  {children}
            </ThemeContext.Provider>
      );
};
