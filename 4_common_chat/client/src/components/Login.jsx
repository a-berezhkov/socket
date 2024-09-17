import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { SetAccessToken } from "../axiosInstance";
import { UserContext } from "../context/UserContext";

function Login() {
  const { setUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (import.meta.env.MODE === "development") {
      axios.get("/api/users/users").then(({ data }) => {
        setUsers(data);
      });
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const { data } = await axios.post("/api/auth/authorization", {
      email: e.target[0].value,
      password: e.target[1].value,
    });
    setUser(data.user);
    SetAccessToken(data.accessToken);
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmitHandler}>
        {import.meta.env.MODE === "development" ? (
          <select>
            {users.map((user) => (
              <option key={user.id}>{user.email}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Username"
            defaultValue={"user@user.ru"}
          />
        )}
        <input type="password" placeholder="Password" defaultValue={"123"} />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
