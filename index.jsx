import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Admin from "./Admin";
import QuickEdit from "./QuickEdit";
import Navigation from "./Navigation";
import "./index.css";

function App() {
  const [currentPage, setCurrentPage] = useState("admin");

  return (
    <>
      {currentPage === "admin" ? <Admin /> : <QuickEdit />}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
