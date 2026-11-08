import { useState } from "react";

const blankTask = {
  title: "",
  description: "",
  dueDate: "",
  status: "PENDING",
  priority: "MEDIUM",
};

const TaskForm = ({ initialData, onSubmit, submitLabel = "Save Task", loading = false }) => {
  const [formData, setFormData] = useState(() => initialData ? {
    title: initialData.title || "",
    description: initialData.description || "",
    dueDate: initialData.dueDate || "",
    status: initialData.status || "PENDING",
    priority: initialData.priority || "MEDIUM",
  } : blankTask);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...formData, title: formData.title.trim() });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input id="title" name="title" maxLength="120" placeholder="Enter task title"
          value={formData.title} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" maxLength="2000" rows="4"
          placeholder="Describe your task..." value={formData.description} onChange={handleChange} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input id="dueDate" type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange}>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default TaskForm;
