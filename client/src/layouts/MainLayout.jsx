import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import TaskModal from '../components/TaskModal.jsx';
import taskService from '../services/taskService.js';
import { useToast } from '../context/ToastContext.jsx';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking');
  const { showToast } = useToast();

  // Check health and db status on mount
  useEffect(() => {
    const checkDbHealth = async () => {
      try {
        const res = await taskService.getHealth();
        setDbStatus(res.database || 'connected');
      } catch {
        setDbStatus('disconnected');
      }
    };
    checkDbHealth();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      setIsSubmitting(true);
      await taskService.createTask(taskData);
      showToast('Task created successfully', 'success');
      setIsCreateModalOpen(false);
      // Trigger a custom event so active pages refresh their data
      window.dispatchEvent(new CustomEvent('task-updated'));
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenCreateTask={() => setIsCreateModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Create Task Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default MainLayout;
