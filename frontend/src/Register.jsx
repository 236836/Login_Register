import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setMsg(data.message || data.error);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
      <form onSubmit={handleRegister} className="flex flex-col gap-3 p-6 bg-slate-800 rounded-lg w-80">
        <h2 className="text-xl font-bold text-center">Register</h2>
        <input className="p-2 bg-slate-700 rounded outline-none" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
        <input className="p-2 bg-slate-700 rounded outline-none" placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} required />
        <input className="p-2 bg-slate-700 rounded outline-none" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold mt-2">Register</button>
        <p className="text-sm text-center text-yellow-400 mt-2">{msg}</p>
      </form>
    </div>
  );
}