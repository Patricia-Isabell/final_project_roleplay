import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Wahlpflichtfacherwahl from "./pages/Wahlpflichtfacherwahl.jsx";

import "./styles/base.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/layout.css";

import RootLayout from "./root/RootLayout.jsx";
import Home from "./pages/Home.jsx";
import Character from "./pages/Character.jsx";
import Game from "./pages/Game.jsx";
import Status from "./pages/Status.jsx";
import Final from "./pages/Final.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/character" element={<Character />} />
      <Route
        path="/wahlpflichtfacherwahl"
        element={<Wahlpflichtfacherwahl />}
      />
      <Route path="/game" element={<Game />} />
      <Route path="/status" element={<Status />} />
      <Route path="/final" element={<Final />} />
      <Route path="*" element={<Home />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
