import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  subtitle?: string
  right?: ReactNode
  children: ReactNode
  className?: string
  padding?: string
}

export function Panel({
  title,
  subtitle,
  right,
  children,
  className = '',
  padding = 'p-5',
}: PanelProps) {
  return (
    <div className={`bg-card border border-line rounded-lg shadow-card ${padding} ${className}`}>
      <PanelHeader title={title} subtitle={subtitle} right={right} />
      {children}
    </div>
  )
}

export function PanelHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <div className="text-[14.5px] font-semibold text-ink tracking-[-0.005em]">
          {title}
        </div>
        {subtitle && (
          <div className="text-[12.5px] text-ink3 mt-1 font-medium">{subtitle}</div>
        )}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  )
}
