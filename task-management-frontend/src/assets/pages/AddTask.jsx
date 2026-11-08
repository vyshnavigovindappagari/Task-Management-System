
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import TaskForm from "../components/TaskForm";
import taskService from "../services/taskService";

const AddTask = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const taskData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        dueDate: formData.dueDate || null,
        status: formData.status,
        priority: formData.priority,
      };

      const response = await taskService.addTask(taskData);

      console.log("Task created successfully:", response);

      toast.success("Task created successfully!");
      navigate("/tasks");

    } catch (err) {
      console.error("Create task error:", err);
      console.error("Backend response:", err.response?.data);

      const responseData = err.response?.data;

      const errorMessage =
        responseData?.error ||
        responseData?.message ||
        (typeof responseData === "string" ? responseData : null) ||
        err.message ||
        "Unable to create task. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Create New Task</h1>
          <p>Add a task and organize your work.</p>
        </div>

        <Link to="/tasks" className="back-link">
          <ArrowLeft size={17} />
          Back to Tasks
        </Link>
      </div>

      <div className="form-card">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <TaskForm
          onSubmit={handleSubmit}
          submitLabel="Create Task"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AddTask;
