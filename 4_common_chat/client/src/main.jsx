import { createRoot } from "react-dom/client";
import App from "./app/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import ChatApp from "./components/ChatApp";
import UserProvider from "./context/UserContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "Chat",
        element: <ChatApp />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
);
