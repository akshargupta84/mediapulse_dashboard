import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { usePeriod } from '../PeriodContext'

export function PeriodSelector() {
  const { period, allPeriods, setPeriodId } = usePeriod()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const ordered = [...allPeriods].reverse()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 text-[12px] bg-card border border-line rounded-md text-ink2 hover:text-ink hover:border-line2 flex items-center gap-2 transition-colors font-medium"
      >
        <span className="text-ink font-semibold">{period.label}</span>
        <span className="text-ink3 hidden sm:inline">· {period.sublabel}</span>
        <ChevronDown size={12} className={`text-ink3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-[240px] bg-card border border-line rounded-md shadow-card-hover p-1 z-50">
          {ordered.map((p) => {
            const active = p.id === period.id
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPeriodId(p.id)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-[12px] flex justify-between items-center rounded transition-colors ${
                  active ? 'bg-bg2 text-ink font-semibold' : 'text-ink2 hover:bg-bg2 hover:text-ink'
                }`}
              >
                <span>{p.label}</span>
                <span className="text-[11px] text-ink3">{p.sublabel}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
