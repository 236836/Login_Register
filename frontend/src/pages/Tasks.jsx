import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // protect page
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const loadTasks = async () => {
    const res = await fetch("http://localhost:8080/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    loadTasks();
  };

  const saveEdit = async (id) => {
    await fetch(`http://localhost:8080/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    });
    setEditId(null);
    loadTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:8080/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-gray-400 text-sm">Hello, {user?.name}</p>
          </div>
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded text-sm">
            Logout
          </button>
        </div>

        {/* CREATE */}
        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input
            className="flex-1 p-2 rounded bg-slate-700 outline-none"
            placeholder="New task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="bg-blue-600 px-4 rounded">Add</button>
        </form>

        {/* READ + UPDATE + DELETE */}
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="bg-slate-800 p-3 rounded flex items-center gap-2">
              {editId === task.id ? (
                <>
                  <input
                    className="flex-1 p-1 rounded bg-slate-700 outline-none"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button onClick={() => saveEdit(task.id)} className="bg-green-600 px-2 py-1 rounded text-sm">Save</button>
                  <button onClick={() => setEditId(null)} className="bg-gray-600 px-2 py-1 rounded text-sm">Cancel</button>
                </>
              ) : (
                <>
                  <span className="flex-1">{task.id}. {task.title}</span>
                  <button
                    onClick={() => { setEditId(task.id); setEditTitle(task.title); }}
                    className="bg-yellow-500 text-black px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="bg-red-600 px-2 py-1 rounded text-sm">
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        {tasks.length === 0 && <p className="text-center text-gray-400 mt-8">No tasks yet</p>}
      </div>
    </div>
  );
}