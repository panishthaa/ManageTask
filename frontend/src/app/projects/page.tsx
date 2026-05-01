'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import api from '@/lib/api';
import { 
  FolderKanban, 
  Plus, 
  Users, 
  CheckSquare, 
  MoreVertical,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  _count: {
    tasks: number;
    members: number;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [createLoading, setCreateLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post('/projects', newProject);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
            <p className="text-slate-500">Manage and organize your team's work</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="input pl-10 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse"></div>)}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderKanban size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No projects found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              {search ? "We couldn't find any projects matching your search." : "Get started by creating your first project to manage tasks with your team."}
            </p>
            {!search && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary mt-6 inline-flex items-center gap-2"
              >
                <Plus size={18} />
                <span>Create your first project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="card hover:border-indigo-300 hover:shadow-md transition-all group h-full flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <FolderKanban size={20} />
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>
                  
                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-6 text-slate-500 text-sm">
                    <div className="flex items-center gap-1.5">
                      <CheckSquare size={16} />
                      <span>{project._count.tasks} tasks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={16} />
                      <span>{project._count.members} members</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Create New Project"
        >
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Project Name</label>
              <input 
                type="text" 
                required 
                className="input" 
                placeholder="e.g., Q2 Marketing Campaign"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea 
                rows={3}
                className="input" 
                placeholder="What is this project about?"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={createLoading}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                {createLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
