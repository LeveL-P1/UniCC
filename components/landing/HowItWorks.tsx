'use client'

import { motion } from 'framer-motion'
import { Search, UserPlus, Share2, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    title: 'Search',
    description: 'Find any competitive programmer by their handle or username',
    icon: Search,
  },
  {
    step: '02',
    title: 'Create',
    description: 'Sign up and link your competitive programming profiles',
    icon: UserPlus,
  },
  {
    step: '03',
    title: 'Share',
    description: 'Get a unique URL to share your unified stats with anyone',
    icon: Share2,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export function HowItWorks() {
  return (
    <section className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-primary mb-3"
          >
            HOW IT WORKS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            Three simple steps
          </motion.h2>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4"
        >
          {STEPS.map((step, index) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              className="relative"
            >
              {/* Connector Line (desktop only) */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px">
                  <div className="w-full h-px bg-gradient-to-r from-border via-primary/50 to-border" />
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                {/* Step Number */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative mb-6"
                >
                  <div className="w-24 h-24 rounded-2xl bg-card border border-border flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      {step.step}
                    </span>
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
