'use client'

import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard, BarChart3, Settings, Menu } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const NAVBAR_HEIGHT = 72

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">

      {/* Top Navigation */}
      <nav className="
        fixed top-0 left-0 right-0 z-50
        bg-[#111]/80 backdrop-blur-xl
        border-b border-white/10
      ">
        <div className="h-16 px-6 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="
                w-9 h-9 rounded-xl
                bg-linear-to-br from-orange-500 to-orange-600
                flex items-center justify-center
                shadow-lg shadow-orange-500/20
              ">
                <span className="font-bold text-lg">U</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                UNICC
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink href="/" icon={<LayoutDashboard size={18} />} active={pathname === '/'}>
                Dashboard
              </NavLink>
              <NavLink href="/sessions" icon={<BarChart3 size={18} />} active={pathname === '/sessions'}>
                Sessions
              </NavLink>
              <NavLink href="/settings" icon={<Settings size={18} />} active={pathname === '/settings'}>
                Settings
              </NavLink>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <Menu size={20} />
            </button>

            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 ring-1 ring-white/20"
                }
              }}
            />
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ paddingTop: NAVBAR_HEIGHT }}>
        {children}
      </main>

    </div>
  )
}

/* ---------------- Nav Link ---------------- */

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
    <a
      href={href}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm
        transition-all duration-200
        ${active
          ? 'text-white bg-white/10'
          : 'text-white/60 hover:text-white hover:bg-white/5'
        }
        hover:-translate-y-px
      `}
    >
      {active && (
        <span className="
          absolute inset-x-2 -bottom-0.5 h-0.5
          bg-linear-to-r from-orange-500 to-orange-400
          rounded-full
        " />
      )}
      {icon}
      {children}
    </a>
  )
}
