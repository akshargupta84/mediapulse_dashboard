import type { PeriodData } from '../data'
import { Panel } from './Panel'

interface Props {
  period: PeriodData
}

export function ChannelPanel({ period }: Props) {
  const channels = [...period.channels].sort((a, b) => b.spend - a.spend)
  const totalSpend = channels.reduce((s, c) => s + c.spend, 0)
  const maxSpend = channels[0]?.spend ?? 1

  return (
    <Panel
      title="Channel mix"
      subtitle={`Share of spend · ${period.label}`}
    >
      <div className="flex flex-col">
        {channels.map((c, i) => {
          const share = (c.spend / totalSpend) * 100
          const barWidth = (c.spend / maxSpend) * 100
          return (
            <div
              key={c.name}
              className={`py-2.5 ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[13px] font-medium text-ink">{c.name}</span>
                  <span className="text-[10px] text-ink3 ml-2">{c.roas}× ROAS · ${c.cpa} CPA</span>
                </div>
                <div className="text-[13px] font-semibold tnum text-ink min-w-[42px] text-right">
                  {share.toFixed(0)}%
                </div>
              </div>
              <div className="h-[3px] bg-bg2 rounded-sm relative mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-sm transition-[width] duration-700"
                  style={{
                    width: `${barWidth}%`,
                    background: i === 0 ? '#b85c3a' : '#1a1a1f',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
