import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'

interface Props {
  id: string
  label: string
  value: string
  delta: string
  deltaLabel: string
  dir: 'up' | 'down'
  positive?: boolean
  accent?: 'ink' | 'accent' | 'sage'
  data: number[]
}

export function KPICard({
  id,
  label,
  value,
  delta,
  deltaLabel,
  positive = true,
  accent = 'ink',
  data,
}: Props) {
  const chartData = data.map((v, i) => ({ i, v }))
  const gradId = `grad-${id}`

  const strokeHex =
    accent === 'accent' ? '#b85c3a' : accent === 'sage' ? '#5a7a5c' : '#1a1a1f'

  return (
    <div className="bg-card border border-line rounded-lg shadow-card p-4 pb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[12px] text-ink3 font-medium uppercase tracking-[0.02em]">
          {label}
        </div>
      </div>

      <div className="text-[30px] font-semibold text-ink leading-none tnum tracking-[-0.02em]">
        {value}
      </div>

      <div className="mt-2 flex items-center gap-2 text-[12.5px] text-ink2">
        <span
          className={`px-2 py-[2px] rounded-full font-semibold text-[11.5px] tnum ${
            positive ? 'bg-upBg text-up' : 'bg-downBg text-down'
          }`}
        >
          {delta}
        </span>
        <span className="text-ink3 text-[12px]">{deltaLabel}</span>
      </div>

      <div className="h-[28px] mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeHex} stopOpacity={0.12} />
                <stop offset="100%" stopColor={strokeHex} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={['auto', 'auto']} />
            <Area
              type="monotone"
              dataKey="v"
              stroke={strokeHex}
              strokeWidth={1.4}
              fill={`url(#${gradId})`}
              isAnimationActive
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
