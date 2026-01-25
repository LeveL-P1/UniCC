'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-card border border-border overflow-hidden transition-colors hover:border-primary/20",
        className
      )}
    >
      {title && (
        <div className="px-6 py-3 border-b border-border flex items-center justify-between bg-accent/20">
          <h3 className="text-xs font-bold text-foreground tracking-widest uppercase font-mono">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {headerAction}
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            )}
          </div>
        </div>
      )}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
          >
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border p-5 transition-colors hover:border-primary/40 group relative"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-mono font-bold text-foreground">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1 font-mono">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground group-hover:text-primary transition-colors">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-2 text-xs font-mono mt-2",
          trend.isPositive ? "text-green-500" : "text-red-500"
        )}>
          <span className="bg-background/50 px-1 py-0.5 rounded border border-border/50">
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-muted-foreground">vs last week</span>
        </div>
      )}

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-primary/50 transition-colors" />
    </motion.div>
  )
}
