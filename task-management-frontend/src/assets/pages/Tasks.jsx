import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ListTodo } from "lucide-react";
import toast from "react-hot-toast";
import TaskCard from "../components/TaskCard";
import taskService from "../services/taskService";

const PAGE_SIZE = 6;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setTasks(await taskService.getAllTasks({ search, status, priority, sort }));
    } catch {
      setError("Unable to load tasks. Please check whether the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, sort]);

  // Synchronize the task list with the selected server-side filters.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadTasks(); }, [loadTasks]);

  const pageCount = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE));
  const visibleTasks = useMemo(
    () => tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [tasks, page]
  );

  const changeFilter = (setter, value) => {
    setPage(1);
    setter(value);
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskService.deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
      toast.success("Task deleted");
    } catch { toast.error("Unable to delete task"); }
  };

  const completeTask = async (id) => {
    try {
      const updated = await taskService.completeTask(id);
      setTasks((current) => current.map((task) => task.id === id ? updated : task));
      toast.success("Task completed");
    } catch { toast.error("Unable to update task"); }
  };

const duplicateTask = async (id) => {
  try {
    const newTask = await taskService.duplicateTask(id);

    toast.success("Task duplicated successfully!");

    setTasks((current) => [newTask, ...current]);
    setPage(1);

  } catch (error) {
    console.error("Duplicate task error:", error);
    toast.error(
      error.response?.data?.error || "Unable to duplicate task"
    );
  }
};


  return (
    <div className="page-content">
      <div className="page-heading">
        <div><h1>My Tasks</h1><p>Search, organize and track all your work.</p></div>
        <Link to="/add-task" className="primary-button link-button"><Plus size={17} /> Add Task</Link>
      </div>
      <div className="filter-bar">
        <div className="search-box"><Search size={18} /><input placeholder="Search title or description..." value={search} onChange={(e) => changeFilter(setSearch, e.target.value)} /></div>
        <select className="filter-select" value={status} onChange={(e) => changeFilter(setStatus, e.target.value)}>
          <option value="">All statuses</option><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option>
        </select>
        <select className="filter-select" value={priority} onChange={(e) => changeFilter(setPriority, e.target.value)}>
          <option value="">All priorities</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>
        </select>
        <select className="filter-select" value={sort} onChange={(e) => changeFilter(setSort, e.target.value)}>
          <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="dueDate">Due date</option><option value="priority">Priority</option><option value="title">Title A-Z</option>
        </select>
      </div>
      {loading ? <div className="loading-state">Loading tasks...</div> :
        error ? <div className="error-message">{error}</div> :
        tasks.length === 0 ? (
          <div className="empty-state"><ListTodo size={35} /><h3>No tasks found</h3><p>Create a task or change your filters.</p><Link to="/add-task" className="primary-button">Create your first task</Link></div>
        ) : (
          <>
            <p className="results-count">Showing {visibleTasks.length} of {tasks.length} tasks</p>
            <div className="task-grid">{visibleTasks.map((task) => <TaskCard key={task.id} task={task} onDelete={deleteTask} onComplete={completeTask}  onDuplicate={duplicateTask}/>)}</div>
            {pageCount > 1 && <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span>Page {page} of {pageCount}</span>
              <button disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>}
          </>
        )}
    </div>
  );
};

export default Tasks;
