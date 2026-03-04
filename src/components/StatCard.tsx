interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  colour?: string
}

export default function StatCard({ label, value, sub, colour }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-6 py-5">
      {colour && (
        <div
          className="w-2 h-2 rounded-full mb-3"
          style={{ backgroundColor: colour }}
        />
      )}
      <div className="text-3xl font-bold text-slate-900 tabular-nums">{value}</div>
      <div className="text-sm font-medium text-slate-600 mt-1">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  )
}
