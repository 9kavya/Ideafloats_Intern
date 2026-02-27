import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

import Layout from "./components/Layout";
import MyDay from "./pages/MyDay";
import Important from "./pages/Important";
import Planned from "./pages/Planned";
import Assigned from "./pages/Assigned";
import Flagged from "./pages/Flagged";
import Tasks from "./pages/Tasks";
import Search from "./pages/Search";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import AuthGuard from "./components/AuthGuard";

import "./styles/index.css";
import "./styles/App.css";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/my-day" replace /> },
      { path: "my-day", element: <MyDay /> },
      { path: "important", element: <Important /> },
      { path: "planned", element: <Planned /> },
      { path: "assigned", element: <Assigned /> },
      { path: "flagged", element: <Flagged /> },
      { path: "tasks", element: <Tasks /> },
      { path: "search", element: <Search /> },
      { path: "list/:listId", element: <Tasks /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/my-day" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <TaskProvider>
      <RouterProvider router={router} />
    </TaskProvider>
  </AuthProvider>
);
