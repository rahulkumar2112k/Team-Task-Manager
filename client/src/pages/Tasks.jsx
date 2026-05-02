import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import API from "../services/api";
import { getStoredUser } from "../utils/auth";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const emptyTask = {
  title: "",
  description: "",
  projectId: "",
  assignedTo: "",
  dueDate: "",
  priority: "medium",
};

export default function Tasks() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyTask);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tasks");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      API.get("/tasks"),
      API.get("/projects"),
      isAdmin ? API.get("/auth/users") : Promise.resolve({ data: [] }),
    ])
      .then(([taskRes, projectRes, userRes]) => {
        if (!isMounted) return;
        setTasks(taskRes.data);
        setProjects(projectRes.data);
        setUsers(userRes.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load tasks");
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

  const createTask = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const res = await API.post("/tasks", form);
      setTasks((prev) => [res.data.task, ...prev]);
      setForm(emptyTask);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create task");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      await API.put(`/tasks/${taskId}`, {
        status: newStatus,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      void fetchTasks();
    }
  };

  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };
  const selectedProject = projects.find(
    (project) => project._id === form.projectId
  );
  const selectedProjectMemberIds =
    selectedProject?.members?.map((member) =>
      typeof member === "string" ? member : member._id
    ) || [];
  const assigneeOptions = form.projectId
    ? users.filter((member) => selectedProjectMemberIds.includes(member._id))
    : users;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        <Navbar title={isAdmin ? "Admin Tasks" : "My Tasks"} />

        <main className="p-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            Tasks Board
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {isAdmin
              ? "Assign work and move tasks across the team board."
              : "Update the status of tasks assigned to you."}
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
            <section className="flex-1 min-w-0">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(columns).map(([key, value]) => (
                    <Droppable droppableId={key} key={key}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-md min-h-[400px]"
                        >
                          <h2 className="text-lg font-semibold mb-4 capitalize text-gray-700 dark:text-white">
                            {key.replace("-", " ")}
                          </h2>

                          {value.map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TaskCard
                                    task={task}
                                    dragging={snapshot.isDragging}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>
            </section>

            {isAdmin && (
              <form
                onSubmit={createTask}
                className="w-full xl:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
              >
                <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  New task
                </h2>

                <input
                  name="title"
                  value={form.title}
                  placeholder="Task title"
                  className="w-full p-3 mb-3 rounded border dark:bg-gray-800 dark:text-white"
                  onChange={updateField}
                />

                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Description"
                  className="w-full p-3 mb-3 rounded border min-h-24 dark:bg-gray-800 dark:text-white"
                  onChange={updateField}
                />

                <select
                  name="projectId"
                  value={form.projectId}
                  className="w-full p-3 mb-3 rounded border dark:bg-gray-800 dark:text-white"
                  onChange={updateField}
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>

                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  className="w-full p-3 mb-3 rounded border dark:bg-gray-800 dark:text-white"
                  onChange={updateField}
                >
                  <option value="">Assign to</option>
                  {assigneeOptions.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>

                <input
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  className="w-full p-3 mb-3 rounded border dark:bg-gray-800 dark:text-white"
                  onChange={updateField}
                />

                <select
                  name="priority"
                  value={form.priority}
                  className="w-full p-3 mb-4 rounded border dark:bg-gray-800 dark:text-white"
                  onChange={updateField}
                >
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  Create task
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
