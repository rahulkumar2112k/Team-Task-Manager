export default function TaskCard({ task, dragging }) {
  return (
    <div
      className={`p-3 mb-3 rounded-lg shadow transition ${
        dragging
          ? "bg-indigo-500 text-white"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
      }`}
    >
      <p className="font-medium">{task.title}</p>
      {task.description && (
        <p className="text-sm opacity-80 mt-1">{task.description}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-3 text-xs">
        {task.project?.name && (
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
            {task.project.name}
          </span>
        )}
        {task.priority && (
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 capitalize">
            {task.priority}
          </span>
        )}
      </div>
    </div>
  );
}
