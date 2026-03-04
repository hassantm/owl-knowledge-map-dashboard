import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '▤' },
  { to: '/graph', label: 'Graph View', icon: '◎' },
  { to: '/concepts', label: 'Concepts', icon: '◈' },
  { to: '/browse', label: 'Browse', icon: '≡' },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-slate-900 text-white flex flex-col">
        <div className="px-5 pt-6 pb-5 border-b border-slate-700">
          <div className="text-base font-bold tracking-tight leading-tight">OWL Knowledge Map</div>
          <div className="text-xs text-slate-400 mt-1">Opening Worlds Curriculum</div>
        </div>
        <nav className="flex-1 py-4 px-2">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium mb-1 transition-colors ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
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
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
