import { LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../utils/auth";

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const html = document.documentElement;
    const nextDark = !html.classList.contains("dark");

    html.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setDark(nextDark);
  };

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 flex justify-between items-center px-8 py-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h1>
        {user && (
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {user.name} · {user.role}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 grid place-items-center"
          aria-label="Toggle theme"
        >
          {dark ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="h-10 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white inline-flex items-center gap-2 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
