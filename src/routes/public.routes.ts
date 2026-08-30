import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Main from "../pages/Main.js";
import "../styles/index.css"


const router = createBrowserRouter([
    {
        path: "/",
        element: <Main/>,
    },
]);

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
    <RouterProvider router={router} />,
);
