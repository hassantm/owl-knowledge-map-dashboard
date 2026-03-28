import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Share2, CalendarRange, Bookmark, Search } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/graph', label: 'Graph View', Icon: Share2 },
  { to: '/timeline', label: 'Timeline', Icon: CalendarRange },
  { to: '/concepts', label: 'Concepts', Icon: Bookmark },
  { to: '/browse', label: 'Browse', Icon: Search },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-slate-900 text-white flex flex-col">
        {/* Brand header — house purple accent */}
        <div className="px-5 pt-6 pb-5 border-b border-slate-700" style={{ borderTopWidth: 3, borderTopColor: '#865595', borderTopStyle: 'solid' }}>
          <div className="text-base font-semibold tracking-tight leading-tight">OWL Knowledge Map</div>
          <div className="text-xs text-slate-400 mt-1">Opening Worlds Curriculum</div>
        </div>
        <nav className="flex-1 py-4 px-2">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium mb-1 transition-colors ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-700">
          <div className="text-xs text-slate-500">
            Counsell &amp; Mastin<br />
            Opening Worlds Ltd
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-h-0 h-full">
        {children}
      </main>
    </div>
  )
}
