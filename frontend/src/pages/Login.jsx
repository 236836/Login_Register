import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMsg(data.message);
      setTimeout(() => navigate("/tasks"), 800);
    } else {
      setMsg(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-slate-800 p-6 rounded-xl w-full max-w-sm flex flex-col gap-3">
        <h1 className="text-xl font-bold text-center">Login</h1>
        <input className="p-2 rounded bg-slate-700 outline-none" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="p-2 rounded bg-slate-700 outline-none" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-green-600 hover:bg-green-700 py-2 rounded font-semibold">Login</button>
        <p className="text-center text-yellow-400 text-sm">{msg}</p>
        <p className="text-center text-gray-400 text-sm">
          No account? <Link className="text-blue-400" to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}