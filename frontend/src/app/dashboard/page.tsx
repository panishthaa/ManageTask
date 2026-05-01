'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import api from '@/lib/api';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo, 
  Briefcase,
  ArrowRight,
  Plus,
  User
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { clsx } from 'clsx';

interface DashboardStats {
  totalTasks: number;
  stats: {
    TODO?: number;
    IN_PROGRESS?: number;
    DONE?: number;
  };
  overdueTasks: number;
  recentTasks: any[];
  totalProjects: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500">Welcome back to your task manager</p>
          </div>
          <Link href="/projects" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>New Project</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Tasks" 
            value={stats?.totalTasks || 0} 
            icon={ListTodo} 
            color="indigo" 
          />
          <StatsCard 
            title="In Progress" 
            value={stats?.stats?.IN_PROGRESS || 0} 
            icon={Clock} 
            color="amber" 
          />
          <StatsCard 
            title="Completed" 
            value={stats?.stats?.DONE || 0} 
            icon={CheckCircle2} 
            color="green" 
          />
          <StatsCard 
            title="Overdue" 
            value={stats?.overdueTasks || 0} 
            icon={AlertCircle} 
            color="red" 
            description="Tasks needing attention"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold">Recent Tasks</h2>
                <Link href="/projects" className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline">
                  View all projects <ArrowRight size={14} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4">Task</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats?.recentTasks.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                          No tasks found. Create a project to get started!
                        </td>
                      </tr>
                    ) : (
                      stats?.recentTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                            <p className="text-xs text-slate-500 truncate max-w-xs">{task.description}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                              <Briefcase size={12} />
                              {task.project.name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={clsx(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              task.status === 'DONE' && "bg-green-100 text-green-800",
                              task.status === 'IN_PROGRESS' && "bg-amber-100 text-amber-800",
                              task.status === 'TODO' && "bg-slate-100 text-slate-800"
                            )}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 bg-indigo-600 text-white border-none shadow-indigo-200">
              <h3 className="text-lg font-bold mb-2">Projects Overview</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{stats?.totalProjects || 0}</span>
                <span className="text-indigo-200">Active Projects</span>
              </div>
              <p className="text-indigo-100 text-sm mt-4">
                You have {stats?.totalProjects} active projects across your organization.
              </p>
              <Link 
                href="/projects" 
                className="mt-6 w-full py-2 bg-white text-indigo-600 rounded-lg font-bold text-sm block text-center hover:bg-indigo-50 transition-colors"
              >
                Go to Projects
              </Link>
            </div>

            <div className="card p-6">
              <h3 className="text-base font-bold mb-4">Quick Help</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Plus size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">New Projects</p>
                    <p className="text-xs text-slate-500">Create projects to group your team's tasks.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Team Roles</p>
                    <p className="text-xs text-slate-500">Assign members as Admin or Member per project.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
