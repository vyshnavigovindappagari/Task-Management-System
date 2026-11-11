
import { useEffect, useState } from "react";
import {
  Activity as ActivityIcon,
  PlusCircle,
  Pencil,
  CheckCircle2,
  Trash2,
  Clock,
} from "lucide-react";

import api from "../services/api";

const actionConfig = {
  CREATED: {
    label: "Task Created",
    icon: PlusCircle,
    className: "created",
  },
  UPDATED: {
    label: "Task Updated",
    icon: Pencil,
    className: "updated",
  },
  COMPLETED: {
    label: "Task Completed",
    icon: CheckCircle2,
    className: "completed",
  },
  DELETED: {
    label: "Task Deleted",
    icon: Trash2,
    className: "deleted",
  },
};

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);

        const response = await api.get("/api/activities");
        setActivities(response.data);
      } catch (err) {
        console.error("Activity history error:", err);
        setError("Unable to load activity history.");
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const formatDate = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Activity History</h1>
          <p>Track all your task activities in one place.</p>
        </div>
      </div>

      <div className="activity-card">
        <div className="activity-header">
          <div className="activity-header-icon">
            <ActivityIcon size={22} />
          </div>

          <div>
            <h2>Recent Activities</h2>
            <p>Your latest 100 task activities</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading activities...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : activities.length === 0 ? (
          <div className="empty-state">
            <ActivityIcon size={35} />
            <h3>No activities yet</h3>
            <p>Create, update or complete a task to see its history here.</p>
          </div>
        ) : (
          <div className="activity-timeline">
            {activities.map((activity) => {
              const config =
                actionConfig[activity.action] || actionConfig.UPDATED;

              const Icon = config.icon;

              return (
                <div className="activity-item" key={activity.id}>
                  <div className={`activity-icon ${config.className}`}>
                    <Icon size={18} />
                  </div>

                  <div className="activity-details">
                    <div className="activity-title-row">
                      <strong>{config.label}</strong>
                      <span className="activity-time">
                        <Clock size={13} />
                        {formatDate(activity.createdAt)}
                      </span>
                    </div>

                    <p className="activity-task-title">
                      {activity.taskTitle}
                    </p>

                    <p className="activity-description">
                      {activity.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
