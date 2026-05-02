import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { getStoredUser, storeSession } from "../utils/auth";

export default function Dashboard() {
  const [data, setData] = useState({});
  const [user, setUser] = useState(getStoredUser());
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([API.get("/tasks/dashboard"), API.get("/auth/me")])
      .then(([dashboardRes, meRes]) => {
        if (!isMounted) return;
        setData(dashboardRes.data);
        setUser(meRes.data);
        storeSession({
          token: localStorage.getItem("token"),
          user: meRes.data,
        });
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load dashboard");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        <Navbar title={isAdmin ? "Admin Dashboard" : "Member Dashboard"} />

        <main className="p-8">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isAdmin ? "Team overview" : "My work overview"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isAdmin
                ? "Track all team tasks, overdue work, and project activity."
                : "Track your assigned tasks and what needs attention next."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Card title="Total Tasks" value={data.total} />
            <Card title="Todo" value={data.todo} />
            <Card title="In Progress" value={data.inProgress} />
            <Card title="Completed" value={data.done} />
            <Card title="Overdue" value={data.overdue} red />
          </div>
        </main>
      </div>
    </div>
  );
}

function Card({ title, value, red }) {
  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-md hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h2
        className={`text-2xl font-bold ${
          red ? "text-red-500" : "text-gray-800 dark:text-white"
        }`}
      >
        {value || 0}
      </h2>
    </div>
  );
}
