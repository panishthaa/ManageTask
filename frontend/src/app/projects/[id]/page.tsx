'use client';

import React, { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import api from '@/lib/api';
import { 
  CheckSquare, 
  Plus, 
  Users, 
  Settings, 
  Calendar,
  User as UserIcon,
  AlertCircle,
  Clock,
  CheckCircle2,
  Filter,
  Trash2,
  Edit2
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  members: any[];
  creator: any;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  assignee?: { id: string, name: string };
}

export default function ProjectDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { user: currentUser } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<any[]>([]); // For assignment
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'members' | 'settings'>('tasks');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  
  // Forms
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    assigneeId: ''
  });
  const [memberForm, setMemberForm] = useState({ userId: '', role: 'MEMBER' });

  const fetchData = async () => {
    try {
      const [projRes, taskRes, userRes] = await Promise.all([
        api.get(`/projects/${params.id}`),
        api.get(`/tasks?projectId=${params.id}`),
        api.get('/users')
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
      setUsers(userRes.data);
    } catch (error) {
      console.error('Failed to fetch project data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...taskForm, projectId: params.id });
      setIsTaskModalOpen(false);
      setTaskForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
      fetchData();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      fetchData();
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${params.id}/members`, memberForm);
      setIsMemberModalOpen(false);
      setMemberForm({ userId: '', role: 'MEMBER' });
      fetchData();
    } catch (error) {
      console.error('Failed to add member', error);
    }
  };

  const isProjectAdmin = project?.members.find(m => m.userId === currentUser?.id)?.role === 'ADMIN';

  const filteredTasks = tasks.filter(t => statusFilter === 'ALL' || t.status === statusFilter);

  if (loading) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="p-8 text-center">Loading project...</div></div>;
  if (!project) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="p-8 text-center text-red-500">Project not found</div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold uppercase tracking-wider mb-1">
              <Link href="/projects" className="hover:underline">Projects</Link>
              <span>/</span>
              <span>Details</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-500 mt-1">{project.description}</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Add Task</span>
            </button>
            {isProjectAdmin && (
              <button 
                onClick={() => setIsMemberModalOpen(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Users size={18} />
                <span>Invite</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8 gap-8">
          {[
            { id: 'tasks', label: 'Tasks', icon: CheckSquare },
            { id: 'members', label: 'Team', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${
                activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mr-4 ml-2">
                <Filter size={16} />
                <span>Filter:</span>
              </div>
              {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === status 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.length === 0 ? (
                <div className="col-span-full card p-12 text-center text-slate-400">
                  No tasks found with this status.
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div key={task.id} className="card p-5 group flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        task.priority === 'HIGH' ? 'bg-red-50 text-red-600' : 
                        task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {task.priority}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"><Edit2 size={14} /></button>
                        {isProjectAdmin && <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 size={14} /></button>}
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 mb-2">{task.title}</h4>
                    <p className="text-slate-500 text-xs mb-4 flex-grow line-clamp-3">{task.description}</p>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Calendar size={14} />
                          <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No date'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <UserIcon size={14} />
                          <span>{task.assignee?.name || 'Unassigned'}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {task.status !== 'DONE' ? (
                          <button 
                            onClick={() => handleUpdateTaskStatus(task.id, task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE')}
                            className="flex-1 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                            {task.status === 'TODO' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                            {task.status === 'TODO' ? 'Start Task' : 'Complete'}
                          </button>
                        ) : (
                          <div className="flex-1 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                            <CheckCircle2 size={14} />
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined At</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.members.map((m) => (
                  <tr key={m.id}>
                    <td className="px-6 py-4 font-semibold text-slate-900">{m.user.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{m.user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        m.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{format(new Date(m.joinedAt), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 text-right">
                      {isProjectAdmin && m.userId !== currentUser?.id && (
                        <button className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Task Modal */}
        <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create New Task">
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Title</label>
              <input type="text" required className="input" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea rows={2} className="input" value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select className="input" value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value as any})}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <input type="date" className="input" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign To</label>
              <select className="input" value={taskForm.assigneeId} onChange={e => setTaskForm({...taskForm, assigneeId: e.target.value})}>
                <option value="">Unassigned</option>
                {project.members.map(m => (
                  <option key={m.userId} value={m.userId}>{m.user.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setIsTaskModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Create Task</button>
            </div>
          </form>
        </Modal>

        {/* Member Modal */}
        <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title="Add Team Member">
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select User</label>
              <select 
                required 
                className="input" 
                value={memberForm.userId} 
                onChange={e => setMemberForm({...memberForm, userId: e.target.value})}
              >
                <option value="">Choose a user...</option>
                {users.filter(u => !project.members.find(m => m.userId === u.id)).map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select className="input" value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})}>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setIsMemberModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Add Member</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
