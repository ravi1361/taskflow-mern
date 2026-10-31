import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  X,
  AlertCircle,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { TableRowSkeleton } from '../components/LoadingSkeleton.jsx';
import TaskModal from '../components/TaskModal.jsx';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx';
import taskService from '../services/taskService.js';
import { formatDate } from '../utils/dateUtils.js';
import { useToast } from '../context/ToastContext.jsx';

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deletingTaskTitle, setDeletingTaskTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        ...(search.trim() && { search: search.trim() }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
        sort: sortOption,
      };

      const res = await taskService.getTasks(params);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortOption, showToast]);

  useEffect(() => {
    // Debounce search slightly to avoid firing on every keystroke
    const debounceTimer = setTimeout(() => {
      fetchTasks();
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [fetchTasks]);

  useEffect(() => {
    // Listen for global task creation
    const handleTaskUpdated = () => fetchTasks();
    window.addEventListener('task-updated', handleTaskUpdated);
    return () => window.removeEventListener('task-updated', handleTaskUpdated);
  }, [fetchTasks]);

  const handleCreateOrUpdate = async (taskData) => {
    try {
      setIsSubmitting(true);
      if (editingTask) {
        await taskService.updateTask(editingTask._id, taskData);
        showToast('Task updated successfully', 'success');
      } else {
        await taskService.createTask(taskData);
        showToast('Task created successfully', 'success');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (task) => {
    setDeletingTaskId(task._id);
    setDeletingTaskTitle(task.title);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    try {
      setIsDeleting(true);
      await taskService.deleteTask(deletingTaskId);
      showToast('Task deleted successfully', 'success');
      setDeletingTaskId(null);
      setDeletingTaskTitle('');
      fetchTasks();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      showToast('Status updated', 'success');
      fetchTasks();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortOption('newest');
  };

  const hasActiveFilters =
    search.trim() !== '' || statusFilter !== 'all' || priorityFilter !== 'all' || sortOption !== 'newest';

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Title & New Task Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            All Tasks
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage, organize, filter, and track all your tasks
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="dueDate">Sort: Due Date</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-slate-100">{tasks.length}</strong> {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Task List / Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-10">
            <EmptyState
              title={hasActiveFilters ? 'No matching tasks' : 'No tasks yet'}
              description={
                hasActiveFilters
                  ? 'No tasks matched your current search or filter criteria. Try adjusting them.'
                  : 'Get started by creating your first task in TaskFlow.'
              }
              onAction={
                hasActiveFilters
                  ? handleClearFilters
                  : () => {
                      setEditingTask(null);
                      setIsModalOpen(true);
                    }
              }
              actionLabel={hasActiveFilters ? 'Clear Filters' : 'Create Task'}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Task Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Task Title & Description */}
                    <td className="py-4 px-4 max-w-xs sm:max-w-md">
                      <div className="font-medium text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {task.title}
                      </div>
                      {task.description && (
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="text-xs font-medium px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>

                    {/* Priority Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    {/* Due Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      {task.dueDate ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No due date</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                          title="Edit Task"
                          aria-label={`Edit ${task.title}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(task)}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                          title="Delete Task"
                          aria-label={`Delete ${task.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingTaskId}
        onClose={() => {
          setDeletingTaskId(null);
          setDeletingTaskTitle('');
        }}
        onConfirm={handleConfirmDelete}
        taskTitle={deletingTaskTitle}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TasksPage;
