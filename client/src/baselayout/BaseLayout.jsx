import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { themeContext } from "../context/ThemeContext";

const BaseLayout = () => {
  const { currentTheme } = useContext(themeContext);
  return (
    <div className="w-full h-dvh flex flex-col" data-theme={currentTheme}>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default BaseLayout;
