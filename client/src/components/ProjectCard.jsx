import { Trash2 } from "lucide-react";

export default function ProjectCard({ project, canDelete, onDelete }) {
  const stats = project.stats || {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    progress: 0,
  };
  const deadline = project.deadline || {
    daysRemaining: null,
    isOverdue: false,
  };
  const memberNames =
    project.members
      ?.map((member) => member.name)
      .filter(Boolean)
      .join(", ") || "No members assigned";
  const progressReports = project.progressReports || [];

  return (
    <article
      className={`bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm ${
        deadline.isOverdue
          ? "border-red-300 dark:border-red-800"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          {project.name}
        </h2>

        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(project._id)}
            className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 grid place-items-center"
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 min-h-10">
        {project.description || "No description yet."}
      </p>

      <div className="flex flex-wrap gap-2 mt-4 text-xs">
        {project.dueDate && (
          <span
            className={`px-2 py-1 rounded ${
              deadline.isOverdue
                ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
            }`}
          >
            {deadline.isOverdue
              ? `${Math.abs(deadline.daysRemaining)} days overdue`
              : deadline.daysRemaining === 0
                ? "Due today"
                : `${deadline.daysRemaining} days left`}
          </span>
        )}
        {project.dueDate && (
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            Due {new Date(project.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{stats.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4 text-center">
        <Metric label="Tasks" value={stats.total} />
        <Metric label="Todo" value={stats.todo} />
        <Metric label="Doing" value={stats.inProgress} />
        <Metric label="Done" value={stats.done} />
      </div>

      <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
          Members
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {memberNames}
        </p>
      </div>

      <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
          Member updates
        </p>

        {progressReports.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No member progress reported yet.
          </p>
        ) : (
          <div className="space-y-3">
            {progressReports.map((report) => (
              <div key={report._id || report.member?._id}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {report.member?.name || "Member"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {report.percent}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${report.percent}%` }}
                  />
                </div>
                {report.note && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {report.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        {value || 0}
      </p>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}
