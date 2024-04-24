import { createContext, useState } from "react";

//INITIAL VALUE / SKELETONNYA
export const themeContext = createContext({
  currentTheme: "Dark",
  handleTheme: () => {},
  theme: {
    light: {
      dataTheme: "light",
    },
    dark: {
      dataTheme: "dark",
    },
  },
});

//PROVIDERNYA
export default function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState("dark");

  function handleTheme() {
    if (currentTheme == "light") setCurrentTheme("dark");
    else setCurrentTheme("light");
  }

  return (
    <themeContext.Provider
      value={{
        currentTheme,
        handleTheme,
        theme: {
          light: {
            dataTheme: "light",
          },
          dark: {
            dataTheme: "dark",
          },
        },
      }}
    >
      {children}
    </themeContext.Provider>
  );
}
