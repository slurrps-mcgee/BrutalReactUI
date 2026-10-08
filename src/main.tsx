import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, ToastProvider, ToastViewport } from "../lib/main";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
        <ToastViewport />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
