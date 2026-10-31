import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';

const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    icon: ArrowDown,
    badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    iconClass: 'text-slate-500',
  },
  medium: {
    label: 'Medium',
    icon: ArrowRight,
    badgeClass: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    iconClass: 'text-orange-500',
  },
  high: {
    label: 'High',
    icon: ArrowUp,
    badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    iconClass: 'text-rose-500',
  },
};

export const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${config.badgeClass}`}
    >
      <Icon className={`w-3 h-3 ${config.iconClass}`} />
      {config.label}
    </span>
  );
};

export default PriorityBadge;
