import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import { InterviewProvider } from "./context/interview-context";
import { ThemeProvider, useTheme } from "./context/theme-context";
import "./index.css";

function Notifications() {
  const { theme } = useTheme();
  return <Toaster theme={theme} richColors closeButton position="top-right" />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <InterviewProvider>
        <App />
        <Notifications />
      </InterviewProvider>
    </ThemeProvider>
  </StrictMode>,
);
