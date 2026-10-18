import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DashboardLayout() {
  return /*#__PURE__*/_jsxs("div", {
    className: "h-screen flex overflow-hidden",
    children: [/*#__PURE__*/_jsx(Sidebar, {}), /*#__PURE__*/_jsxs("div", {
      className: "flex-1 flex flex-col overflow-hidden",
      children: [/*#__PURE__*/_jsx(Header, {}), /*#__PURE__*/_jsx("main", {
        className: "flex-1 overflow-y-auto bg-background p-6",
        children: /*#__PURE__*/_jsx(Outlet, {})
      })]
    })]
  });
}