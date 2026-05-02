import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import API from "../services/api";
import { getStoredUser } from "../utils/auth";

export default function Projects() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    durationDays: "10",
  });
  const [memberForm, setMemberForm] = useState({ projectId: "", userId: "" });
  const [progressForm, setProgressForm] = useState({
    projectId: "",
    percent: "0",
    note: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      API.get("/projects"),
      isAdmin ? API.get("/auth/users") : Promise.resolve({ data: [] }),
    ])
      .then(([projectRes, userRes]) => {
        if (isMounted) {
          setProjects(projectRes.data);
          setUsers(userRes.data);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load projects");
      });

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const updateField = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createProject = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const res = await API.post("/projects", form);
      setProjects((prev) => [res.data.project, ...prev]);
      setForm({ name: "", description: "", durationDays: "10" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not create project");
    }
  };

  const updateMemberField = (event) => {
    setMemberForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const addMember = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const res = await API.post("/projects/add-member", memberForm);
      setProjects((prev) =>
        prev.map((project) =>
          project._id === res.data.project._id ? res.data.project : project
        )
      );
      setMemberForm({ projectId: "", userId: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not add member");
    }
  };

  const deleteProject = async (projectId) => {
    setError("");

    try {
      await API.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((project) => project._id !== projectId));
      setMemberForm((prev) =>
        prev.projectId === projectId ? { ...prev, projectId: "" } : prev
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete project");
    }
  };

  const updateProgressField = (event) => {
    setProgressForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const updateProjectProgress = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const res = await API.patch(
        `/projects/${progressForm.projectId}/progress`,
        {
          percent: progressForm.percent,
          note: progressForm.note,
        }
      );
      setProjects((prev) =>
        prev.map((project) =>
          project._id === res.data.project._id ? res.data.project : project
        )
      );
      setProgressForm({ projectId: "", percent: "0", note: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not update progress");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        <Navbar title={isAdmin ? "Admin Projects" : "Member Projects"} />

        <main className="p-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            Projects
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {isAdmin
              ? "Create projects and review the teams attached to them."
              : "View the projects where you are listed as a member."}
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <section className="flex-1 min-w-0">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    canDelete={isAdmin}
                    onDelete={deleteProject}
                  />
                ))}
              </div>
            </section>

            {isAdmin && (
              <aside className="w-full lg:w-80 space-y-4">
                <form
                  onSubmit={createProject}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
                >
                  <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">
                    New project
                  </h2>

                  <input
                    name="name"
                    value={form.name}
                    placeholder="Project name"
                    className="w-full p-3 mb-3 rounded border dark:bg-gray-800 dark:text-white"
                    onChange={updateField}
                  />

                  <textarea
                    name="description"
                    value={form.description}
                    placeholder="Description"
                    className="w-full p-3 mb-4 rounded border min-h-28 dark:bg-gray-800 dark:text-white"
                    onChange={updateField}
                  />

                  <input
                    name="durationDays"
                    type="number"
                    min="1"
                    value={form.durationDays}
                    placeholder="Duration in days"
                    className="w-full p-3 mb-4 rounded border dark:bg-gray-800 dark:text-white"
                    onChange={updateField}
                  />

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Create project
                  </button>
                </form>

                <form
                  onSubmit={addMember}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
                >
                  <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">
                    Add member
                  </h2>

                  <select
                    name="projectId"
                    value={memberForm.projectId}
                    className="w-full p-3 mb-3 rounded border dark:bg-gray-800 dark:text-white"
                    onChange={updateMemberField}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="userId"
                    value={memberForm.userId}
                    className="w-full p-3 mb-4 rounded border dark:bg-gray-800 dark:text-white"
                    onChange={updateMemberField}
                  >
                    <option value="">Select user</option>
                    {users.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Add member
                  </button>
                </form>
              </aside>
            )}

            {!isAdmin && (
              <aside className="w-full lg:w-80">
                <form
                  onSubmit={updateProjectProgress}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
                >
                  <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">
                    Update progress
                  </h2>

                  <select
                    name="projectId"
                    value={progressForm.projectId}
                    className="w-full p-3 mb-3 rounded border dark:bg-gray-800 dark:text-white"
                    onChange={updateProgressField}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>

                  <input
                    name="percent"
                    type="number"
                    min="0"
                    max="100"
                    value={progressForm.percent}
                    placeholder="Progress percent"
                    className="w-full p-3 mb-3 rounded border dark:bg-gray-800 dark:text-white"
                    onChange={updateProgressField}
                  />

                  <textarea
                    name="note"
                    value={progressForm.note}
                    placeholder="What did you complete?"
                    className="w-full p-3 mb-4 rounded border min-h-24 dark:bg-gray-800 dark:text-white"
                    onChange={updateProgressField}
                  />

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Save progress
                  </button>
                </form>
              </aside>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
