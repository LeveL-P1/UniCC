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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "bg-card rounded-xl border border-border overflow-hidden transition-all hover:border-border/60",
        className
      )}
    >
      {title && (
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground/90 tracking-wide uppercase">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {headerAction}
            {collapsible && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </motion.div>
              </motion.button>
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
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2 }}
      className="bg-card rounded-xl border border-border p-6 transition-all hover:border-border/60 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {title}
          </p>
          <motion.h3
            className="text-3xl font-outfit font-bold text-foreground"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {value}
          </motion.h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <motion.div
            className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center text-primary"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
      {trend && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "flex items-center gap-1 text-sm",
            trend.isPositive ? "text-green-500" : "text-red-500"
          )}
        >
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-muted-foreground ml-1">vs last week</span>
        </motion.div>
      )}
    </motion.div>
  )
}
