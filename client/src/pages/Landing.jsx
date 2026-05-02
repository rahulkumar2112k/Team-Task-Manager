import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react";
import heroImage from "../assets/hero.png";

export default function Landing() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const handleToggle = () => {
    const html = document.documentElement;
    const nextDark = !html.classList.contains("dark");

    html.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setDark(nextDark);
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-gray-950 dark:bg-[#090d16] dark:text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-xl font-bold tracking-tight"
        >
          Task Manager
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white dark:text-gray-200 dark:hover:bg-white/10 sm:block"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleToggle}
            className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-gray-100"
            aria-label="Toggle theme"
          >
            {dark ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-10">
        <section className="grid min-h-[calc(100vh-88px)] items-center gap-10 py-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
              <CheckCircle2 size={16} />
              A calm workspace for accountable teams
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-normal md:text-6xl">
              Keep every team moving in the same direction.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Team Task Manager gives managers and members one shared place to
              understand priorities, own responsibilities, and stay ahead of
              slipping work without chasing updates across chats.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                Open workspace
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                Create account
              </button>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <Stat value="Clear" label="Ownership" />
              <Stat value="Focused" label="Execution" />
              <Stat value="Visible" label="Progress" />
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80 dark:border-white/10 dark:bg-[#111827] dark:shadow-black/40">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Work health snapshot
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    A quick read on where attention is needed
                  </p>
                </div>
                <div className="rounded-lg bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">
                  72% done
                </div>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-3">
                  {[
                    ["Website Redesign", "10 days left", 68],
                    ["Mobile App Launch", "15 days left", 42],
                    ["Analytics Upgrade", "25 days left", 84],
                  ].map(([name, days, progress]) => (
                    <div
                      key={name}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {name}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {days}
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-[#111827] p-4 text-white dark:bg-black/30">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-semibold">Task board</p>
                    <img
                      src={heroImage}
                      alt=""
                      className="h-14 w-14 object-contain"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <PreviewColumn
                      title="Todo"
                      items={["Review copy", "QA mobile"]}
                    />
                    <PreviewColumn
                      title="Doing"
                      items={["Build login", "Assign members"]}
                    />
                    <PreviewColumn
                      title="Done"
                      items={["Plan scope", "Seed data"]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ValueCard
                title="For managers"
                text="See ownership, deadlines, and delivery risk before work goes quiet."
              />
              <ValueCard
                title="For members"
                text="Know exactly what matters next and where each task stands."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/10">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

function PreviewColumn({ title, items }) {
  return (
    <div className="rounded-lg bg-white/10 p-3">
      <p className="mb-3 text-sm font-semibold text-gray-200">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-md bg-white/10 p-2 text-xs">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueCard({ title, text }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/10">
      <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
}
