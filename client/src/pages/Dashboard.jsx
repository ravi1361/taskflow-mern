import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Clock,
  CircleDot,
  CheckCircle2,
  ArrowRight,
  Plus,
  Calendar,
} from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { CardSkeleton } from '../components/LoadingSkeleton.jsx';
import TaskModal from '../components/TaskModal.jsx';
import taskService from '../services/taskService.js';
import { formatDate } from '../utils/dateUtils.js';
import { useToast } from '../context/ToastContext.jsx';

export const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsRes, tasksRes] = await Promise.all([
        taskService.getTaskStats(),
        taskService.getTasks({ sort: 'newest' }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (tasksRes.success) {
        // Take the 5 most recent tasks for the preview
        setRecentTasks(tasksRes.data.slice(0, 5));
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboardData();

    // Listen to global task events (created/updated from header or modal)
    const handleTaskUpdated = () => fetchDashboardData();
    window.addEventListener('task-updated', handleTaskUpdated);
    return () => window.removeEventListener('task-updated', handleTaskUpdated);
  }, [fetchDashboardData]);

  const handleCreateTask = async (taskData) => {
    try {
      setIsSubmitting(true);
      await taskService.createTask(taskData);
      showToast('Task created successfully', 'success');
      setIsModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      showToast('Task status updated', 'success');
      fetchDashboardData();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Task Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {currentDate} • Full-stack MERN workflow overview
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Task</span>
        </button>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Tasks"
              count={stats.total}
              icon={Layers}
              color="indigo"
              description="All tracked items"
            />
            <StatCard
              title="In Progress"
              count={stats.inProgress}
              icon={Clock}
              color="blue"
              description="Currently active"
            />
            <StatCard
              title="Pending"
              count={stats.pending}
              icon={CircleDot}
              color="amber"
              description="Awaiting action"
            />
            <StatCard
              title="Completed"
              count={stats.completed}
              icon={CheckCircle2}
              color="emerald"
              description="Done and verified"
            />
          </>
        )}
      </div>

      {/* Recent Tasks Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Recent Tasks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest items added to your workspace
            </p>
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-2/3" />
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No tasks created yet"
              description="Create your first task to start tracking your project workflow."
              onAction={() => setIsModalOpen(true)}
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentTasks.map((task) => (
              <div
                key={task._id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {task.title}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.description && (
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  )}

                  {/* Quick status selector */}
                  <select
                    value={task.status}
                    onChange={(e) => handleQuickStatusChange(task._id, e.target.value)}
                    className="text-xs font-medium px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Dashboard;
