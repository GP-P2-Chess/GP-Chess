import { Link, useNavigate } from "react-router-dom";
import socket from "../socket";
import { useContext } from "react";
import { themeContext } from "../context/ThemeContext";
import { IoIosSunny } from "react-icons/io";
import { GiMoon } from "react-icons/gi";
import Toastify from "toastify-js";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentTheme, handleTheme } = useContext(themeContext);

  const handleLogout = () => {
    localStorage.clear();
    socket.disconnect();

    Toastify({
      text: "Logout Success",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "rgb(0, 215, 192)",
        color: "#000000",
      },
    }).showToast();

    navigate("/");
  };

  return (
    <nav className="navbar bg-accent text-black">
      <div className="navbar-start">
        <img src="" alt="" />
        <Link
          to={"/"}
          className="btn btn-ghost text-xl flex justify-center items-center"
        >
          ChessWithFriends
        </Link>
      </div>
      <div className="navbar-center">
        {currentTheme == "light" ? (
          <IoIosSunny onClick={handleTheme} className="cursor-pointer size-8" />
        ) : (
          <GiMoon onClick={handleTheme} className="cursor-pointer size-8" />
        )}
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-accent rounded-box w-52"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
