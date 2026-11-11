
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

import taskService from "../services/taskService";

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await taskService.getAllTasks({});
        setTasks(data);
      } catch (err) {
        console.error("Calendar loading error:", err);
        setError("Unable to load calendar tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = useMemo(() => {
    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  }, [firstDay, daysInMonth]);

  const tasksByDate = useMemo(() => {
    const grouped = {};

    tasks.forEach((task) => {
      if (task.dueDate) {
        if (!grouped[task.dueDate]) {
          grouped[task.dueDate] = [];
        }

        grouped[task.dueDate].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  const selectedTasks = tasksByDate[selectedDate] || [];

  const formatDateKey = (day) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");

    return `${year}-${m}-${d}`;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today.toLocaleDateString("en-CA"));
  };

  const todayKey = new Date().toLocaleDateString("en-CA");

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Task Calendar</h1>
          <p>View and manage tasks according to their due dates.</p>
        </div>

        <Link to="/add-task" className="primary-button">
          + Add Task
        </Link>
      </div>

      <div className="calendar-card">
        <div className="calendar-toolbar">
          <div>
            <h2>
              <CalendarDays size={21} />
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <p>Tasks scheduled for each day</p>
          </div>

          <div className="calendar-navigation">
            <button onClick={goToToday}>Today</button>

            <button
              onClick={goToPreviousMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading calendar...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="calendar-weekdays">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day) => (
                  <div key={day}>{day}</div>
                )
              )}
            </div>

            <div className="calendar-grid">
              {calendarCells.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      className="calendar-day empty"
                      key={`empty-${index}`}
                    />
                  );
                }

                const dateKey = formatDateKey(day);
                const dayTasks = tasksByDate[dateKey] || [];
                const isToday = dateKey === todayKey;
                const isSelected = dateKey === selectedDate;

                return (
                  <button
                    key={dateKey}
                    className={`calendar-day ${
                      isToday ? "today" : ""
                    } ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedDate(dateKey)}
                  >
                    <span className="calendar-day-number">
                      {day}
                    </span>

                    <div className="calendar-task-list">
                      {dayTasks.slice(0, 2).map((task) => (
                        <span
                          key={task.id}
                          className={`calendar-task priority-${(
                            task.priority || "MEDIUM"
                          ).toLowerCase()}`}
                        >
                          {task.title}
                        </span>
                      ))}

                      {dayTasks.length > 2 && (
                        <span className="calendar-more">
                          +{dayTasks.length - 2} more
                        </span>
                      )}
                    </div>

                    {dayTasks.length > 0 && (
                      <span className="calendar-task-count">
                        {dayTasks.length} tasks
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="calendar-legend">
              <span><i className="legend-dot high" /> High</span>
              <span><i className="legend-dot medium" /> Medium</span>
              <span><i className="legend-dot low" /> Low</span>
            </div>
          </>
        )}
      </div>

      <div className="selected-date-panel">
        <h2>
          <Clock3 size={20} />
          Tasks for {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}
        </h2>

        {selectedTasks.length === 0 ? (
          <p className="calendar-empty">
            No tasks scheduled for this date.
          </p>
        ) : (
          <div className="selected-task-list">
            {selectedTasks.map((task) => (
              <Link
                to={`/edit-task/${task.id}`}
                key={task.id}
                className="selected-task-item"
              >
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.description || "No description"}</p>
                </div>

                <span className={`status-badge ${task.status?.toLowerCase()}`}>
                  {task.status?.replaceAll("_", " ")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
