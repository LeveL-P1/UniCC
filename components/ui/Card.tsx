'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface CardProps {
  title?: string
  children: React.ReactNode
  collapsible?: boolean
  defaultCollapsed?: boolean
  className?: string
  headerAction?: React.ReactNode
}

export function Card({ 
  title, 
  children, 
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  headerAction
}: CardProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <div className={`bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
          <h3 className="text-lg font-outfit font-semibold text-white tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {headerAction}
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-lg hover:bg-[#242424] text-gray-400 hover:text-white transition-colors"
              >
                {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
            )}
          </div>
        </div>
      )}
      {!isCollapsed && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  )
}

// KPI Card Component (for stats)
interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function KPICard({ title, value, subtitle, icon, trend }: KPICardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 hover:border-[#3a3a3a] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-outfit font-bold text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="text-sm text-[#a0a0a0] mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-[#242424] flex items-center justify-center text-[#ff6b35]">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-[#a0a0a0] ml-1">vs last week</span>
        </div>
      )}
    </div>
  )
}