import { createBrowserRouter } from "react-router-dom";
import BaseLayout from "../baselayout/BaseLayout";
import HomePage from "../views/HomePage";
import GamePage from "../views/GamePage";
import LeaderBoard from "../views/LeaderBoard";
import LoginPage from "../views/LoginPage";
import RegisterPage from "../views/RegisterPage";

const url = "http://localhost:3000";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage url={url} />,
  },
  {
    path: "/register",
    element: <RegisterPage url={url} />,
  },
  {
    element: <BaseLayout url={url} />,
    children: [
      {
        path: "/",
        element: <HomePage url={url} />,
      },
      {
        path: "/game-page",
        element: <GamePage url={url} />,
      },
      {
        path: "/leaderboard",
        element: <LeaderBoard url={url} />,
      },
    ],
  },
]);

export default router;
