import type { LucideIcon } from 'lucide-react'

/** A single stat (optional icon + number + label), used in the homepage trust band. */
export default function Stat({ value, label, icon: Icon }: { value: string; label: string; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col items-center text-center px-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-brand-600" />}
        <p className="text-2xl font-bold text-brand-600">{value}</p>
      </div>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  )
}
