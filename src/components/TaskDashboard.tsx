'use client';

import { useState, useMemo } from 'react';
import type { Task, TaskStatus } from '@/types/database';
import {
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
} from '@/app/actions/tasks';
import TaskStats from '@/components/TaskStats';
import TaskFilter, { FilterType } from '@/components/TaskFilter';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import {
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  X,
  SearchX,
  Sparkles,
} from 'lucide-react';

interface TaskDashboardProps {
  initialTasks: Task[];
}

export default function TaskDashboard({ initialTasks }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    taskToEdit?: Task | null;
  }>({
    isOpen: false,
    mode: 'create',
    taskToEdit: null,
  });

  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Counts
  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = total - completed;
    return { all: total, pending, completed };
  }, [tasks]);

  // Filter & Search
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === 'all' ? true : task.status === filter;

      const matchesSearch =
        searchQuery.trim() === ''
          ? true
          : task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, searchQuery]);

  // Handlers
  const handleOpenAdd = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      taskToEdit: null,
    });
  };

  const handleOpenEdit = (task: Task) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      taskToEdit: task,
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleModalSubmit = async (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => {
    if (modalState.mode === 'create') {
      const res = await createTask({
        title: data.title,
        description: data.description,
      });

      if (!res.success || !res.data) {
        showToast('error', res.error || 'Failed to create task');
        return { success: false, error: res.error };
      }

      setTasks((prev) => [res.data!, ...prev]);
      showToast('success', 'Task created successfully!');
      return { success: true };
    } else if (modalState.mode === 'edit' && modalState.taskToEdit) {
      const res = await updateTask(modalState.taskToEdit.id, {
        title: data.title,
        description: data.description,
        status: data.status,
      });

      if (!res.success || !res.data) {
        showToast('error', res.error || 'Failed to update task');
        return { success: false, error: res.error };
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === res.data!.id ? res.data! : t))
      );
      showToast('success', 'Task updated successfully!');
      return { success: true };
    }

    return { success: false, error: 'Invalid modal operation' };
  };

  const handleToggleStatus = async (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );

    const res = await toggleTaskStatus(taskId, currentStatus);

    if (!res.success) {
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: currentStatus } : t))
      );
      showToast('error', res.error || 'Failed to update task status');
    } else {
      showToast(
        'success',
        nextStatus === 'completed'
          ? 'Task marked as completed!'
          : 'Task marked as pending'
      );
    }
  };

  const handleDelete = async (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    // Optimistic delete
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    const res = await deleteTask(taskId);

    if (!res.success) {
      // Rollback
      if (taskToDelete) {
        setTasks((prev) => [taskToDelete, ...prev]);
      }
      showToast('error', res.error || 'Failed to delete task');
    } else {
      showToast('success', 'Task deleted successfully');
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl transition-all ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950 dark:text-emerald-100'
              : 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950 dark:text-red-100'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Task Summary Metrics */}
      <TaskStats
        total={counts.all}
        pending={counts.pending}
        completed={counts.completed}
      />

      {/* Filter and Actions Bar */}
      <TaskFilter
        currentFilter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
        onOpenAddModal={handleOpenAdd}
      />

      {/* Task Cards Grid / Empty States */}
      {tasks.length === 0 ? (
        // Global empty state: user has no tasks yet
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 px-4 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            No tasks yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            Keep yourself organized and productive. Add your first task to get started!
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <ClipboardList className="h-4 w-4" />
            <span>Create your first task</span>
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        // Filtered empty state: no tasks match the filter or search
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 py-12 px-4 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 mb-3">
            <SearchX className="h-6 w-6" />
          </div>
          <h4 className="text-base font-semibold text-zinc-900 dark:text-white">
            No matching tasks found
          </h4>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {searchQuery
              ? `No tasks matched "${searchQuery}". Try a different keyword.`
              : `You have no tasks in the "${filter}" category.`}
          </p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Reset filters
          </button>
        </div>
      ) : (
        // Task List Grid
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        taskToEdit={modalState.taskToEdit}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
