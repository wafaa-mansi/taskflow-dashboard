import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import TaskFilter from "./components/TaskFilter.jsx";
import TaskStatistics from "./components/TaskStatistics.jsx";
import DeleteModal from "./components/DeleteModal.jsx";

import useLocalStorage from "./hooks/useLocalStorage.js";

import "./App.css";

const ThemeContext = createContext(null);

const priorityOrder = {
  High: 1,
  Medium: 2,
  Low: 3,
};

function Dashboard() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");

  const [editingTask, setEditingTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const stats = useMemo(() => {
    return {
      total: tasks.length,

      pending: tasks.filter(
        (task) => task.status === "Pending"
      ).length,

      inProgress: tasks.filter(
        (task) => task.status === "In Progress"
      ).length,

      completed: tasks.filter(
        (task) => task.status === "Completed"
      ).length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesStatus =
        filter === "All" || task.status === filter;

      return matchesSearch && matchesStatus;
    });

    return result.sort((a, b) => {
      if (sort === "priority") {
        return (
          priorityOrder[b.priority] -
          priorityOrder[a.priority]
        );
      }

      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sort === "oldest") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });
  }, [tasks, search, filter, sort]);

  function handleSave(form) {
    if (editingTask) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...form }
            : task
        )
      );

      setEditingTask(null);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        createdAt: new Date().toISOString(),
      };

      setTasks((previous) => [
        newTask,
        ...previous,
      ]);
    }
  }

  const handleDelete = useCallback((id) => {
    setDeleteId(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteId === null) {
      return;
    }

    setTasks((previous) =>
      previous.filter((task) => task.id !== deleteId)
    );

    setEditingTask((previous) =>
      previous?.id === deleteId ? null : previous
    );

    setDeleteId(null);
  }, [deleteId, setTasks]);

  
const handleEdit = useCallback((task) => {
  setEditingTask(task);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, []);

const handleStatusChange = useCallback((id, status) => {
  setTasks((previous) =>
    previous.map((task) =>
      task.id === id
        ? { ...task, status }
        : task
    )
  );
}, [setTasks]);


  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <div className="header-inner">
          <h1>TaskFlow</h1>

          <div className="header-right">
            <span>My Dashboard</span>

            <button
              className="theme-btn"
              onClick={toggleTheme}
            >
              {theme === "light"
                ? "🌙"
                : "☀️"}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <div className="page-heading">
          <h1>Task Overview</h1>

          <p>Track and organize your daily work</p>
        </div>

        <TaskStatistics stats={stats} />

        <div className="dashboard-grid">
          <section className="panel">
            <h2>My Tasks</h2>

            <TaskFilter
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
            />

            <TaskList
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </section>

          <TaskForm
            editingTask={editingTask}
            onSave={handleSave}
            onCancel={() => setEditingTask(null)}
          />
        </div>
      </main>

      {deleteId !== null && (
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useLocalStorage(
    "taskflow-theme",
    "light"
  );

  const toggleTheme = useCallback(() => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  }, [setTheme]);

  const themeValue = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <Dashboard />
    </ThemeContext.Provider>
  );
}
