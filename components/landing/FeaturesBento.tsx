'use client'

import { motion } from 'framer-motion'
import { Search, Link2, BarChart3, Shield, Zap, Share2 } from 'lucide-react'

const FEATURES = [
  {
    title: 'Unified Search',
    description: 'Search any competitive programmer by their handle across all platforms',
    icon: Search,
    color: '#ff6b35',
    size: 'large',
  },
  {
    title: 'Link Your Profiles',
    description: 'Connect your LeetCode, Codeforces, CodeChef, and more in one place',
    icon: Link2,
    color: '#1890FF',
    size: 'medium',
  },
  {
    title: 'Detailed Analytics',
    description: 'Problems solved, ratings, contest history, and performance trends',
    icon: BarChart3,
    color: '#10B981',
    size: 'medium',
  },
  {
    title: 'Privacy Controls',
    description: 'Choose what stats to show publicly and what to keep private',
    icon: Shield,
    color: '#8B5CF6',
    size: 'small',
  },
  {
    title: 'Real-time Sync',
    description: 'Auto-sync your latest stats from all platforms',
    icon: Zap,
    color: '#F59E0B',
    size: 'small',
  },
  {
    title: 'Shareable Profile',
    description: 'Get a unique link to share your combined CP profile',
    icon: Share2,
    color: '#EC4899',
    size: 'small',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export function FeaturesBento() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-primary mb-3"
          >
            FEATURES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Everything you need to showcase
            <br />
            <span className="text-primary">your competitive edge</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            One profile to rule them all. Aggregate your stats, share your achievements,
            and connect with the competitive programming community.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                y: -4,
                transition: { duration: 0.2 }
              }}
              className={`
                relative overflow-hidden rounded-2xl border border-border bg-card p-6
                hover:border-border/80 hover:shadow-xl transition-shadow
                ${feature.size === 'large' ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''}
                ${feature.size === 'medium' ? '' : ''}
              `}
            >
              {/* Glow Effect */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30"
                style={{ backgroundColor: feature.color }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <feature.icon
                  className="w-6 h-6"
                  style={{ color: feature.color }}
                />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Large card extra content */}
              {feature.size === 'large' && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-muted border-2 border-card"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Join 10,000+ competitive programmers
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
