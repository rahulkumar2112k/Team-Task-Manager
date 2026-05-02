import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

export default function App() {
  const isAuth = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/projects"
        element={isAuth ? <Projects /> : <Navigate to="/login" />}
      />
      <Route
        path="/tasks"
        element={isAuth ? <Tasks /> : <Navigate to="/login" />}
      />

      <Route
        path="/dashboard"
        element={
          isAuth ? <Dashboard /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}
