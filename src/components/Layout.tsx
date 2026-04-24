import { NavLink } from 'react-router-dom'
import { BookOpen, Share2, CalendarRange, Bookmark, Search, BarChart3, Sparkles } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Prepare', Icon: BookOpen, end: true },
  { to: '/architecture', label: 'Architecture', Icon: Share2 },
  { to: '/timeline', label: 'Timeline', Icon: CalendarRange },
  { to: '/concepts', label: 'Concepts', Icon: Bookmark },
  { to: '/browse', label: 'Browse', Icon: Search },
  { to: '/overview', label: 'Overview', Icon: BarChart3 },
  { to: '/vocabulary', label: 'Vocabulary', Icon: Sparkles },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center h-14 gap-8">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-1.5 h-7 rounded-full bg-owl-purple" />
            <div>
              <div className="text-sm font-bold tracking-tight text-ink leading-none">
                OWL Knowledge Map
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                Opening Worlds Curriculum
              </div>
            </div>
          </NavLink>

          {/* Navigation links */}
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-owl-purple/10 text-owl-purple font-semibold'
                      : 'text-slate-500 hover:text-ink hover:bg-slate-50'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
