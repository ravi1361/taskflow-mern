import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
    </div>
    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded mt-4" />
    <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800/60 rounded mt-2" />
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800/60">
    <td className="py-4 px-4">
      <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800/60 rounded mt-2" />
    </td>
    <td className="py-4 px-4">
      <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
    </td>
    <td className="py-4 px-4">
      <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
    </td>
    <td className="py-4 px-4">
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
    </td>
    <td className="py-4 px-4 text-right">
      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
    </td>
  </tr>
);

export default { CardSkeleton, TableRowSkeleton };
