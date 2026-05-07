import {
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  X,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({
  isOpen,
  setIsOpen,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      name: "Tasks",
      icon: ListTodo,
      path: "/tasks",
    },
  ];

  return (
    <>
      {/* MOBILE BACKDROP */}
      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
            md:hidden
          "
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-64
          h-screen
          overflow-y-auto
          bg-white/80
          dark:bg-gray-900/90
          backdrop-blur-xl
          border-r
          border-gray-200
          dark:border-gray-700
          shadow-2xl
          flex
          flex-col
          transition-transform
          duration-300
          ease-in-out
          md:relative
          md:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            p-6
            border-b
            border-gray-200
            dark:border-gray-700
          "
        >
          <div>
            <h2 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white">
              Task Manager
            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Team Workspace
            </p>
          </div>

          {/* MOBILE CLOSE BUTTON */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              md:hidden
              p-2
              rounded-lg
              text-gray-500
              hover:bg-gray-100
              dark:hover:bg-gray-800
              hover:text-gray-700
              dark:hover:text-gray-300
              transition
            "
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item) => {
            const active =
              location.pathname === item.path;

            const Icon = item.icon;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`
                  group
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  text-left
                  font-medium
                  transition-all
                  duration-300
                  ${
                    active
                      ? `
                        bg-gradient-to-r
                        from-indigo-500
                        to-purple-600
                        text-white
                        shadow-lg
                        scale-[1.02]
                      `
                      : `
                        text-gray-700
                        dark:text-gray-300
                        hover:bg-gray-100
                        dark:hover:bg-gray-800
                      `
                  }
                `}
              >
                <Icon
                  size={19}
                  className={`
                    transition-transform
                    duration-300
                    ${
                      active
                        ? ""
                        : "group-hover:scale-110"
                    }
                  `}
                />

                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div
          className="
            p-4
            border-t
            border-gray-200
            dark:border-gray-700
            text-center
          "
        >
          <p className="text-xs text-gray-400">
            Task Manager v1.0
          </p>
        </div>
      </aside>
    </>
  );
}