import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Admin from "./admin/Admin.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ContentProvider } from "./context/ContentContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContentProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  </StrictMode>,
);
