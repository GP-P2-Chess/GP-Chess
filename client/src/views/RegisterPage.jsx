import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = ({ url }) => {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const usernameInput = (e) => {
    setLoginForm({
      ...loginForm,
      username: e.target.value,
    });
  };

  const passwordInput = (e) => {
    setLoginForm({
      ...loginForm,
      password: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleFormInput = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios.post(`${url}/login`, loginForm, {});

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="h-dvh flex flex-row">
      <div className="w-1/2 h-full flex justify-center items-center">
        <h1>ChessWithFriends</h1>
      </div>
      <div className="w-1/2 h-full flex justify-center items-center">
        <div className="w-2/3 bg-base-200 flex flex-col justify-center items-center rounded-xl border-2 shadow-md p-12 gap-4">
          <p className="font-bold text-xl">Sign up to play!</p>
          <form
            action=""
            className="w-full flex flex-col gap-2 justify-center items-center"
            onSubmit={handleFormInput}
          >
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Username"
                value={loginForm.username}
                onChange={usernameInput}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                className="grow w-1/2"
                placeholder="Password"
                value={loginForm.password}
                onChange={passwordInput}
              />
            </label>
            <button type="submit" className="btn btn-primary w-1/3 mt-2">
              Sign Up
            </button>
          </form>
          <p>
            Already have an account?{" "}
            <Link to={"/login"} className="text-primary">
              Login Now!
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
