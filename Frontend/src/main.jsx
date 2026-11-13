import { createRoot } from "react-dom/client";
import AppRoutes from "./Routes.jsx";
import "./shared/styles/index.css";
import "./styles/theme.css";

createRoot(document.getElementById("root")).render(<AppRoutes />);