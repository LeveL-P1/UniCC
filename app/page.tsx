import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, KPICard } from '@/components/ui/Card'
import { Code2, Target, Flame, Clock } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Problems"
            value="247"
            subtitle="All time"
            icon={<Code2 size={24} />}
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="This Week"
            value="23"
            subtitle="7 days"
            icon={<Target size={24} />}
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="Current Streak"
            value="12"
            subtitle="days"
            icon={<Flame size={24} />}
          />
          <KPICard
            title="Total Time"
            value="89h"
            subtitle="Practice time"
            icon={<Clock size={24} />}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="PROBLEMS PER DAY" collapsible>
            <div className="h-64 flex items-center justify-center text-[#a0a0a0]">
              <p>Line Chart Placeholder</p>
            </div>
          </Card>

          <Card title="DIFFICULTY DISTRIBUTION" collapsible>
            <div className="h-64 flex items-center justify-center text-[#a0a0a0]">
              <p>Bar Chart Placeholder</p>
            </div>
          </Card>
        </div>

        {/* Recent Sessions & Topics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="RECENT SESSIONS" className="lg:col-span-2" collapsible>
            <div className="h-64 flex items-center justify-center text-[#a0a0a0]">
              <p>Sessions Table Placeholder</p>
            </div>
          </Card>

          <Card title="TOPICS PRACTICED">
            <div className="h-64 flex items-center justify-center text-[#a0a0a0]">
              <p>Topics Heatmap Placeholder</p>
            </div>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  )
}