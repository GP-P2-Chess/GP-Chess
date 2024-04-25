import { createBrowserRouter, redirect } from "react-router-dom";
import BaseLayout from "../baselayout/BaseLayout";
import GamePage from "../views/GamePage";
import LoginPage from "../views/LoginPage";
import RegisterPage from "../views/RegisterPage";

const url = "34.124.195.26";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage url={url} />,
    loader: () => {
      if (localStorage.access_token) {
        return redirect("/");
      }
      return null;
    },
  },
  {
    path: "/register",
    element: <RegisterPage url={url} />,
    loader: () => {
      if (localStorage.access_token) {
        return redirect("/");
      }
      return null;
    },
  },
  {
    element: <BaseLayout url={url} />,
    loader: () => {
      if (!localStorage.access_token) {
        return redirect("/login");
      }
      return null;
    },
    children: [
      {
        path: "/",
        element: <GamePage url={url} />,
      },
    ],
  },
]);

export default router;
