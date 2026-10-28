import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(data.message);
      setTimeout(() => navigate("/login"), 800);
    } else {
      setMsg(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-slate-800 p-6 rounded-xl w-full max-w-sm flex flex-col gap-3">
        <h1 className="text-xl font-bold text-center">Register</h1>
        <input className="p-2 rounded bg-slate-700 outline-none" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="p-2 rounded bg-slate-700 outline-none" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="p-2 rounded bg-slate-700 outline-none" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold">Register</button>
        <p className="text-center text-yellow-400 text-sm">{msg}</p>
        <p className="text-center text-gray-400 text-sm">
          Have account? <Link className="text-blue-400" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}