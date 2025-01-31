import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

const fetchCsrfToken = async () => {
  const response = await api.get("/csrf-token");
  console.log("getting csrf token: " + response.data.token)
  return response.data.token;
};

const registerUser = async (username: string, password: string, csrfToken: string) => {
  const response = await api.post(
    "auth/register",
    { username, password },
    { headers: { "X-XSRF-TOKEN": csrfToken } }
  );
  console.log(response.data);
};

const sendTestRequest = async (csrfToken: string) => {
  const response = await api.post(
    "/api/protected",
    { data: "Test data" },
    { headers: { "X-XSRF-TOKEN": csrfToken } }
  );
  console.log(response.data);
};

const App: React.FC = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchCsrfToken().then(setCsrfToken);
  }, []);

  return (
    <div>
      <h1>CSRF Protection Example</h1>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => csrfToken && registerUser(username, password, csrfToken)}>Register</button>
      <button onClick={() => csrfToken && sendTestRequest(csrfToken)}>Send Test Request</button>
    </div>
  );
};

export default App;
