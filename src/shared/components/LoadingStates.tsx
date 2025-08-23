import React from 'react'
import { useTranslation } from 'react-i18next'

// Skeleton components for better loading UX
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="data-table">
    <table className="w-full">
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-6 py-4">
              <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4">
                <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const CardSkeleton: React.FC = () => (
  <div className="metric-card animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-20"></div>
      </div>
      <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
)

export const LocationCardSkeleton: React.FC = () => (
  <div className="management-card animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-24"></div>
      </div>
      <div className="h-6 bg-slate-200 rounded-full w-16"></div>
    </div>
    
    <div className="space-y-2 mb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="w-4 h-4 bg-slate-200 rounded mr-2"></div>
          <div className="h-4 bg-slate-200 rounded flex-1"></div>
        </div>
      ))}
    </div>
    
    <div className="flex items-center space-x-2">
      <div className="flex-1 h-8 bg-slate-200 rounded-lg"></div>
      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
    </div>
  </div>
)

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({ 
  size = 'md', 
  text 
}) => {
  const { t } = useTranslation()
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4`}></div>
      {text && (
        <p className="text-slate-600 font-medium arabic-text">
          {text || t('loading')}
        </p>
      )}
    </div>
  )
}

export const EmptyState: React.FC<{ 
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}> = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-12">
    <Icon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-slate-800 mb-2 arabic-heading">{title}</h3>
    <p className="text-slate-600 mb-6 arabic-text">{description}</p>
    {action && (
      <button onClick={action.onClick} className="cold-button">
        {action.label}
      </button>
    )}
  </div>
)

export default {
  TableSkeleton,
  CardSkeleton,
  LocationCardSkeleton,
  LoadingSpinner,
  EmptyState
}