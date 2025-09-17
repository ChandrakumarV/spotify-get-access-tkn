import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./pages/App";
import Callback from "./pages/Callback";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  </BrowserRouter>
);
