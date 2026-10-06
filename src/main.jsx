import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../app/globals.css";
import App, { getFromQuery, getRepQuery } from "../app/glean-edge/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App
      initialPath={window.location.pathname}
      initialFrom={getFromQuery(window.location.search)}
      initialRep={getRepQuery(window.location.search)}
    />
  </StrictMode>,
);
