import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    navigate("/login");
  };

  return (
    <nav className="navbar bg-base-300 h-1/10">
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
        <Link
          to={"/leaderboard"}
          className="btn btn-ghost text-lg flex justify-center items-center"
        >
          Leaderboard
        </Link>
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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
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
