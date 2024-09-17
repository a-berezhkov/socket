import { useContext, useEffect } from "react";
import "./App.css";
import axiosInstance, { SetAccessToken } from "../axiosInstance";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function App() {
  const { user } = useContext(UserContext);
  useEffect(() => {
    axiosInstance.get("/tokens/refresh").then(({ data }) => {
      SetAccessToken(data.accessToken);
    });
  }, []);

  return (
    <>
      <nav>
        <ul style={{ display: "flex", listStyle: "none" }}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">login</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
          <li>{user ? "ID" + user.id : "no user"}</li>
          <li>{user ? user.email : "no user"}</li>
        </ul>
      </nav>

      <Outlet />
 
    </>
  );
}

export default App;
