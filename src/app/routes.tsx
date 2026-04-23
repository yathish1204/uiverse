import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { PresentationDetail } from "./pages/PresentationDetail";
import { Presenters } from "./pages/Presenters";
import { PresenterDetail } from "./pages/PresenterDetail";
import { Presentations } from "./pages/Presentations";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/presentations",
    Component: Presentations,
  },
  {
    path: "/presentation/:id",
    Component: PresentationDetail,
  },
  {
    path: "/presenters",
    Component: Presenters,
  },
  {
    path: "/presenter/:name",
    Component: PresenterDetail,
  },
]);
