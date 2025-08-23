import { WorkLog } from '../types/logwork.types';

export const formatWorkLog = (log: WorkLog): string => {
  return `${log.worker_name} completed ${log.quantity} ${log.product} - ${log.task}`;
};

export const calculateEfficiency = (logs: WorkLog[]): number => {
  if (logs.length === 0) return 0;
  const completed = logs.filter(log => log.completed).length;
  return (completed / logs.length) * 100;
};

export const getWorkLogStats = (logs: WorkLog[]) => {
  const totalTasks = logs.length;
  const completedTasks = logs.filter(log => log.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  return {
    total: totalTasks,
    completed: completedTasks,
    pending: pendingTasks,
    efficiency: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  };
};