import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { storeSession } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [roleView, setRoleView] = useState("member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeRoleView = (role) => {
    setRoleView(role);
    setEmail("");
    setPassword("");
    setError("");
  };

  const fillDemoLogin = (role) => {
    setRoleView(role);
    setError("");

    if (role === "admin") {
      setEmail("rahul@example.com");
      setPassword("123456");
      return;
    }

    setEmail("aman@example.com");
    setPassword("123456");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (res.data.user.role !== roleView) {
        setError(`This account is registered as ${res.data.user.role}.`);
        return;
      }

      storeSession({ token: res.data.token, user: res.data.user });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {roleView === "admin" ? "Admin Login" : "Member Login"}
        </h2>

        <div className="grid grid-cols-2 gap-2 mb-5 rounded-xl bg-gray-100 dark:bg-gray-900 p-1">
          {["member", "admin"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => changeRoleView(role)}
              className={`py-2 rounded-lg capitalize transition ${
                roleView === role
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => fillDemoLogin(roleView)}
          className="w-full py-2 mb-5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {roleView === "admin" ? "Demo Admin" : "Demo Member"}
        </button>

        <input
          type="email"
          value={email}
          placeholder="Email"
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          value={password}
          placeholder="Password"
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          Need an account?{" "}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-300 font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
