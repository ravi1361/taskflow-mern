import api from './api.js';

export const taskService = {
  // Fetch all tasks with optional search, filters and sort
  async getTasks(params = {}) {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Fetch single task by ID
  async getTaskById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update an existing task
  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete a task
  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Fetch dashboard statistics
  async getTaskStats() {
    const response = await api.get('/tasks/stats');
    return response.data;
  },

  // Health check endpoint
  async getHealth() {
    const response = await api.get('/health');
    return response.data;
  },
};

export default taskService;
