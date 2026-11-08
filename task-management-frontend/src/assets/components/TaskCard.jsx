import { CalendarDays, Check, Pencil, Trash2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TaskCard = ({ task, onDelete, onComplete }) => {
  const navigate = useNavigate();
  const status = (task.status || "PENDING").toUpperCase();
  const priority = (task.priority || "MEDIUM").toUpperCase();
  const overdue = task.dueDate && task.dueDate < new Date().toISOString().slice(0, 10) && status !== "COMPLETED";

  return (
    <article className={`task-card ${overdue ? "task-overdue" : ""}`}>
      <div className="task-card-top">
        <h3>{task.title}</h3>
        <span className={`status-badge ${status.toLowerCase().replaceAll("_", "-")}`}>
          {status.replaceAll("_", " ")}
        </span>
      </div>
      <div className="task-badges">
        <span className={`priority-badge ${priority.toLowerCase()}`}>{priority} PRIORITY</span>
        {overdue && <span className="overdue-badge"><AlertCircle size={12} /> OVERDUE</span>}
      </div>
      <p className="task-description">{task.description || "No description provided"}</p>
      <div className="task-card-footer">
        <span className={`due-date ${overdue ? "overdue-text" : ""}`}>
          <CalendarDays size={15} /> {task.dueDate || "No due date"}
        </span>
        <div className="task-actions">
          {status !== "COMPLETED" && (
            <button className="action-button complete-action" onClick={() => onComplete(task.id)} title="Mark completed" aria-label="Mark completed">
              <Check size={17} />
            </button>
          )}
          <button className="action-button edit-action" onClick={() => navigate(`/edit-task/${task.id}`)} title="Edit task" aria-label="Edit task">
            <Pencil size={17} />
          </button>
          <button className="action-button delete-action" onClick={() => onDelete(task.id)} title="Delete task" aria-label="Delete task">
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
