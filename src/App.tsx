import React, { useEffect, useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [update, setUpdate] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  const fetchCsrfToken = async () => {
    const response = await api.get("/csrf-token");
    console.log("getting csrf token: " + response.data.token)
    return response.data.token;
  };

  const registerUser = async (name: string, username: string, password: string, csrfToken: string) => {
    const response = await api.post(
      "/auth/register",
      { name, username, password },
      { headers: { "X-XSRF-TOKEN": csrfToken } }
    );
    console.log(response.data);
    setUpdate(!update);
  };

  const sendTestRequest = async (csrfToken: string) => {
    const response = await api.post(
      "/api/protected",
      { data: "Test data" },
      { headers: { "X-XSRF-TOKEN": csrfToken } }
    );
    console.log(response.data);
    setUpdate(!update);
  };

  const loginUser = async (username: string, password: string, csrfToken: string) => {
    const response = await api.post(
      "/auth/login",
      { username, password },
      { headers: { "X-XSRF-TOKEN": csrfToken } }
    )
    console.log(response.data);
    setUpdate(!update);
  }

  const getSession = async () => {
    const response = await api.get(
      "/auth/getSession",
      { headers: { "Accept": "application/json" } }
    )
    console.log(response.data);
  }

  const logout = async (csrfToken: string) => {
    const response = await api.post(
      "/auth/logout",
      {},
      { headers: { "X-XSRF-TOKEN": csrfToken } }
    );
    console.log(response.data);
    setUpdate(!update);
  }

  useEffect(() => {
    fetchCsrfToken().then(setCsrfToken);
  }, [update]);

  return (
    <>
      <div>
        <h1>CSRF Protection Example</h1>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <button onClick={() => csrfToken && registerUser(name, username, password, csrfToken)}>Register</button>
        <button onClick={() => csrfToken && loginUser(username, password, csrfToken)}>Login</button>
      </div>
      <div>
        <button onClick={() => getSession()}>GetSession</button>
        <button onClick={() => csrfToken && sendTestRequest(csrfToken)}>Send Test Request</button>
      </div>
      <div>
        <button onClick={() => csrfToken && logout(csrfToken)}>logout</button>
      </div>
    </>
  );
};

export default App;
