import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Header() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  return /*#__PURE__*/_jsxs("header", {
    className: "h-16 border-b border-border bg-card px-6 flex items-center justify-between",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-4 ml-4",
      children: [/*#__PURE__*/_jsx("button", {
        onClick: toggleTheme,
        className: "p-2 hover:bg-accent rounded-lg transition-colors",
        "aria-label": "Toggle theme",
        children: isDark ? /*#__PURE__*/_jsx(Sun, {
          className: "w-5 h-5"
        }) : /*#__PURE__*/_jsx(Moon, {
          className: "w-5 h-5"
        })
      }), /*#__PURE__*/_jsxs("button", {
        className: "relative p-2 hover:bg-accent rounded-lg transition-colors",
        children: [/*#__PURE__*/_jsx(Bell, {
          className: "w-5 h-5"
        }), /*#__PURE__*/_jsx("span", {
          className: "absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3 pl-4 border-l border-border",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-8 h-8 bg-primary rounded-full flex items-center justify-center",
          children: /*#__PURE__*/_jsx("span", {
            className: "text-sm font-medium text-primary-foreground",
            children: "AD"
          })
        }), /*#__PURE__*/_jsxs("button", {
          onClick: () => navigate("/"),
          className: "flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors",
          title: "Cerrar sesión",
          children: [/*#__PURE__*/_jsx(LogOut, {
            className: "w-4 h-4"
          }), /*#__PURE__*/_jsx("span", {
            className: "hidden sm:inline",
            children: "Salir"
          })]
        })]
      })]
    })]
  });
}