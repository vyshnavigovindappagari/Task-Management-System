import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, ListTodo, AlertTriangle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import taskService from "../services/taskService";
import TaskCard from "../components/TaskCard";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().slice(0, 10);

  const load = async () => {
    try { setTasks(await taskService.getAllTasks({ sort: "newest" })); }
    catch { toast.error("Unable to load dashboard data"); }
    finally { setLoading(false); }
  };

  // Fetch dashboard data once when the page mounts.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const overdue = tasks.filter((t) => t.dueDate && t.dueDate < today && t.status !== "COMPLETED").length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const priorityCount = ["HIGH", "MEDIUM", "LOW"].map((priority) => ({
    priority, count: tasks.filter((t) => (t.priority || "MEDIUM") === priority).length
  }));

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try { await taskService.deleteTask(id); setTasks((all) => all.filter((t) => t.id !== id)); toast.success("Task deleted"); }
    catch { toast.error("Unable to delete task"); }
  };
  const completeTask = async (id) => {
    try {
      const updated = await taskService.completeTask(id);
      setTasks((all) => all.map((t) => t.id === id ? updated : t));
      toast.success("Task completed");
    } catch { toast.error("Unable to update task"); }
  };

  if (loading) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <div className="page-content">
      <div className="page-heading">
        <div><h1>Dashboard</h1><p>Here is an overview of your productivity.</p></div>
        <Link to="/add-task" className="primary-button">+ Create Task</Link>
      </div>

      <div className="stats-grid">
        <Stat title="Total Tasks" value={total} icon={<ListTodo size={21} />} color="blue" />
        <Stat title="Pending" value={pending} icon={<Clock3 size={21} />} color="orange" />
        <Stat title="In Progress" value={inProgress} icon={<AlertTriangle size={21} />} color="purple" />
        <Stat title="Completed" value={completed} icon={<CheckCircle2 size={21} />} color="green" />
      </div>

      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <div className="section-heading"><div><h2>Completion progress</h2><p>Your overall task completion</p></div><strong>{percent}%</strong></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
          <div className="progress-foot"><span>{completed} completed</span><span>{Math.max(0, total - completed)} remaining</span></div>
        </section>
        <section className="dashboard-panel">
          <div className="section-heading"><div><h2>Priority overview</h2><p>Tasks grouped by priority</p></div></div>
          {priorityCount.map(({ priority, count }) => <div className="priority-row" key={priority}>
            <span className={`priority-badge ${priority.toLowerCase()}`}>{priority}</span>
            <div className="mini-track"><div className={`mini-fill ${priority.toLowerCase()}`} style={{ width: `${total ? count / total * 100 : 0}%` }} /></div>
            <strong>{count}</strong>
          </div>)}
        </section>
      </div>

      <section className="dashboard-panel overdue-panel">
        <div><h2>Overdue tasks</h2><p>{overdue === 0 ? "You are all caught up with deadlines." : `${overdue} task(s) need your attention.`}</p></div>
        <span className="overdue-total">{overdue}</span>
      </section>

      <div className="section-heading recent-heading"><div><h2>Recent tasks</h2><p>Your latest work items</p></div><Link to="/tasks" className="text-link">View all <ArrowRight size={15} /></Link></div>
      {tasks.length === 0 ? <div className="empty-state"><ListTodo size={34} /><h3>No tasks yet</h3><p>Create your first task to get started.</p><Link to="/add-task" className="primary-button">Add Task</Link></div> :
        <div className="task-grid">{tasks.slice(0, 4).map((task) => <TaskCard key={task.id} task={task} onDelete={deleteTask} onComplete={completeTask} />)}</div>}
    </div>
  );
};

const Stat = ({ title, value, icon, color }) => (
  <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><div><p>{title}</p><h2>{value}</h2></div></div>
);

export default Dashboard;
