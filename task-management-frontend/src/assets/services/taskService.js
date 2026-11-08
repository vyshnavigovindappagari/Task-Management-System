import api from "./api";

const taskService = {
  getAllTasks: async (filters = {}) => {
    const response = await api.get("/api/tasks", {
      params: Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value != null)
      ),
    });
    return response.data;
  },
  getTaskById: async (id) => (await api.get(`/api/tasks/${id}`)).data,
  addTask: async (taskData) => (await api.post("/api/tasks", taskData)).data,
  updateTask: async (id, taskData) => (await api.put(`/api/tasks/${id}`, taskData)).data,
  completeTask: async (id) => (await api.patch(`/api/tasks/${id}/complete`)).data,
  deleteTask: async (id) => (await api.delete(`/api/tasks/${id}`)).data,
};

export default taskService;
