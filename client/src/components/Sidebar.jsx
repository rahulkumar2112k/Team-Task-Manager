import { FolderKanban, LayoutDashboard, ListTodo } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Projects", icon: FolderKanban, path: "/projects" },
    { name: "Tasks", icon: ListTodo, path: "/tasks" },
  ];

  return (
    <div className="w-64 h-screen shrink-0 overflow-y-auto bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 shadow-xl flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-wide">
          Task Manager
        </h2>
      </div>

      <div className="p-4 space-y-2 flex-1">
        {menu.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 text-xs text-gray-400 text-center">v1.0</div>
    </div>
  );
}
