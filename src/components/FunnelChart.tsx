import type { PeriodData } from '../data'
import { formatLongCount } from '../data'
import { Panel } from './Panel'

interface Props {
  period: PeriodData
}

export function FunnelChart({ period }: Props) {
  const stages = period.funnel
  const top = stages[0]?.value ?? 1

  return (
    <Panel
      title="Conversion funnel"
      subtitle={`Impression → purchase · ${period.label}`}
    >
      <div className="flex flex-col gap-4">
        {stages.map((s, i) => {
          const pctOfTop = (s.value / top) * 100
          const isLast = i === stages.length - 1
          return (
            <div key={s.name}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-bg2 border border-line flex items-center justify-center text-[10px] font-semibold text-ink2 tnum">
                    {i + 1}
                  </div>
                  <span className="text-[13px] font-medium text-ink">{s.name}</span>
                </div>
                <div className="flex gap-4 items-baseline">
                  <span className="text-[13px] font-semibold text-ink tnum">
                    {formatLongCount(s.value)}
                  </span>
                  {i > 0 && (
                    <span className="text-[11px] text-ink3 tnum min-w-[46px] text-right">
                      {s.conversion}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-2 bg-bg2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{
                    width: `${pctOfTop}%`,
                    background: i === 0 ? '#b85c3a' : '#1a1a1f',
                  }}
                />
              </div>
              {!isLast && (
                <div className="text-[10.5px] text-ink3 mt-1 ml-8">
                  ↳ {(((s.value - stages[i + 1].value) / s.value) * 100).toFixed(1)}% drop-off to next stage
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 max-[520px]:grid-cols-1 gap-3 mt-6 pt-5 border-t border-line">
        <FunnelStat
          label="Overall CVR"
          value={`${((stages[stages.length - 1].value / stages[0].value) * 100).toFixed(2)}%`}
          sub="Impression → purchase"
        />
        <FunnelStat
          label="Click through"
          value={`${stages[1].conversion}%`}
          sub="Impression → click"
        />
        <FunnelStat
          label="Checkout rate"
          value={`${stages[stages.length - 1].conversion}%`}
          sub="Cart → purchase"
        />
      </div>
    </Panel>
  )
}

function FunnelStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border border-line rounded-md px-3.5 py-3 bg-bg">
      <div className="text-[10px] text-ink3 font-medium uppercase tracking-[0.03em]">{label}</div>
      <div className="text-[24px] font-semibold text-ink leading-tight mt-0.5 tnum tracking-[-0.02em]">
        {value}
      </div>
      <div className="text-[10.5px] text-ink3 mt-0.5">{sub}</div>
    </div>
  )
}
