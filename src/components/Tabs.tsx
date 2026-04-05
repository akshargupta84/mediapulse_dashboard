import type { LucideIcon } from 'lucide-react'

export interface TabDef {
  id: string
  label: string
  icon: LucideIcon
  description: string
  fkey: string
}

interface Props {
  tabs: TabDef[]
  activeId: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, activeId, onChange }: Props) {
  return (
    <div className="mb-5 flex items-center gap-1 border-b border-line">
      {tabs.map((t) => {
        const isActive = t.id === activeId
        const Icon = t.icon
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-[15px] font-medium transition-colors relative -mb-px border-b-2 ${
              isActive
                ? 'text-ink border-ink'
                : 'text-ink3 hover:text-ink border-transparent'
            }`}
          >
            <Icon size={16} />
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
