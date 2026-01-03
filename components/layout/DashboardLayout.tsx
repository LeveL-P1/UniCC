'use client'

import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard, BarChart3, Settings, Menu } from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff6b35] to-[#e55a28] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <h1 className="text-xl font-outfit font-bold text-white tracking-tight">
                UNICC
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} active>
                DASHBOARD
              </NavLink>
              <NavLink href="/sessions" icon={<BarChart3 size={18} />}>
                SESSIONS
              </NavLink>
              <NavLink href="/settings" icon={<Settings size={18} />}>
                SETTINGS
              </NavLink>
            </div>
          </div>

          {/* Right Side - User & Actions */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#242424] text-gray-400"
            >
              <Menu size={20} />
            </button>

            {/* User Button */}
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9"
                }
              }}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

// Navigation Link Component
function NavLink({ 
  href, 
  icon, 
  children, 
  active = false 
}: { 
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean 
}) {
  return (

    <a href={href}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium tracking-wide
        transition-all duration-200
        ${active
          ? 'text-white bg-[#242424]'
          : 'text-[#a0a0a0] hover:text-white hover:bg-[#242424]'
        }
     `}
    >
      {icon}
      {children}
    </a>
  )
}