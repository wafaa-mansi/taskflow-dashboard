import { useEffect, useRef, useState } from "react";
import * as yup from "yup";

const taskSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Task title is required"),

  description: yup.string(),

  priority: yup
    .string()
    .oneOf(["Low", "Medium", "High"])
    .required(),

  status: yup
    .string()
    .oneOf(["Pending", "In Progress", "Completed"])
    .required(),
});

const emptyForm = {
  title: "",
  description: "",
  priority: "Low",
  status: "Pending",
};

export default function TaskForm({
  onSave,
  editingTask,
  onCancel,
}) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const titleRef = useRef(null);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
      });
    } else {
      setForm(emptyForm);
    }

    setError("");
    titleRef.current?.focus();
  }, [editingTask]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const validatedTask = await taskSchema.validate(form);

      onSave(validatedTask);
      setError("");

      if (!editingTask) {
        setForm(emptyForm);
        titleRef.current?.focus();
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="panel task-form-panel">
      <h2>
        {editingTask ? "Edit Task" : "Add a New Task"}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="task-title">Task Title</label>
        <input
          id="task-title"
          ref={titleRef}
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter task title"
        />

        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="4"
        />

        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label htmlFor="task-status">Status</label>
        <select
          id="task-status"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="primary-btn">
            {editingTask ? "Update Task" : "Save Task"}
          </button>

          {editingTask && (
            <button
              type="button"
              className="secondary-btn"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
