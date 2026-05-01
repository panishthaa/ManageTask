import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color: 'indigo' | 'green' | 'amber' | 'red' | 'slate';
}

export default function StatsCard({ title, value, icon: Icon, description, color }: StatsCardProps) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 shadow-indigo-100',
    green: 'bg-green-50 text-green-600 shadow-green-100',
    amber: 'bg-amber-50 text-amber-600 shadow-amber-100',
    red: 'bg-red-50 text-red-600 shadow-red-100',
    slate: 'bg-slate-50 text-slate-600 shadow-slate-100',
  };

  return (
    <div className="card p-6 flex items-start gap-4">
      <div className={cn("p-3 rounded-xl", colorMap[color])}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </div>
    </div>
  );
}
