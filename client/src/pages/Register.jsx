import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          name="name"
          value={form.name}
          placeholder="Name"
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700"
          onChange={updateField}
        />

        <input
          name="email"
          value={form.email}
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700"
          onChange={updateField}
        />

        <input
          name="password"
          value={form.password}
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700"
          onChange={updateField}
        />

        <select
          name="role"
          value={form.role}
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700"
          onChange={updateField}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          Already registered?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-300 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
