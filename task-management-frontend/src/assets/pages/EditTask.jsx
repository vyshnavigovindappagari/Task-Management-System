import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import TaskForm from "../components/TaskForm";
import taskService from "../services/taskService";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTask = async () => {
      try {
        const data = await taskService.getTaskById(id);
        setTask(data);
      } catch {
        setError("Unable to find this task.");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError("");

      await taskService.updateTask(id, formData);

      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Unable to update task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Edit Task</h1>
          <p>Update your task details and status.</p>
        </div>

        <Link to="/tasks" className="back-link">
          <ArrowLeft size={17} /> Back to Tasks
        </Link>
      </div>

      <div className="form-card">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading task details...</div>
        ) : task ? (
          <TaskForm
            initialData={task}
            onSubmit={handleSubmit}
            submitLabel="Update Task"
            loading={saving}
          />
        ) : null}
      </div>
    </div>
  );
};

export default EditTask;
