import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const BaseLayout = () => {
  return (
    <div className="w-full h-dvh flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default BaseLayout;
