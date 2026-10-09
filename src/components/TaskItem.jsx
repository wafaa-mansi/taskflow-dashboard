
import { memo } from "react";

function TaskItem({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <div className="task-card">
      <div className="task-card-top">
        <h3>{task.title}</h3>

        <span
          className={`priority ${task.priority.toLowerCase()}`}
        >
          {task.priority}
        </span>
      </div>

      <p className="task-description">
        {task.description || "No description provided"}
      </p>

      <div className="task-meta">
        <span>
          Created:{" "}
          {new Date(task.createdAt).toLocaleDateString()}
        </span>

        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value)
          }
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="secondary-btn"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          type="button"
          className="delete-btn"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default memo(TaskItem);
