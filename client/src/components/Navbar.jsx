import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../utils/auth";

export default function Navbar({ title, onMenuClick }) {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const html = document.documentElement;

    const nextDark = !html.classList.contains("dark");

    html.classList.toggle("dark", nextDark);

    localStorage.setItem(
      "theme",
      nextDark ? "dark" : "light"
    );

    setDark(nextDark);
  };

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30
        bg-white/70
        dark:bg-gray-900/70
        backdrop-blur-xl
        border-b
        border-gray-200
        dark:border-gray-700
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          px-4
          py-4
          md:px-8
          md:py-5
        "
      >
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 min-w-0">
          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={onMenuClick}
            className="
              md:hidden
              h-11
              w-11
              flex
              items-center
              justify-center
              rounded-xl
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              shadow-lg
              transition-all
              duration-300
            "
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* TITLE + USER */}
          <div className="min-w-0">
            <h1
              className="
                text-xl
                font-semibold
                text-gray-800
                dark:text-white
                truncate
              "
            >
              {title}
            </h1>

            {user && (
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                  capitalize
                  truncate
                "
              >
                {user.name} · {user.role}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">
          {/* THEME BUTTON */}
          <button
            type="button"
            onClick={toggleTheme}
            className="
              h-11
              w-11
              rounded-xl
              border
              border-gray-300
              dark:border-gray-600
              bg-gray-100
              dark:bg-gray-800
              text-gray-700
              dark:text-gray-200
              grid
              place-items-center
              hover:bg-gray-200
              dark:hover:bg-gray-700
              transition-all
            "
            aria-label="Toggle theme"
          >
            {dark ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* LOGOUT BUTTON */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              h-11
              px-4
              rounded-xl
              bg-red-500
              hover:bg-red-600
              text-white
              inline-flex
              items-center
              gap-2
              transition-all
              duration-300
              font-medium
              shadow-md
            "
          >
            <LogOut size={16} />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}