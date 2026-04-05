import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { WeekPoint } from '../data'
import { Panel } from './Panel'

interface Props {
  title?: string
  subtitle: string
  weeks: WeekPoint[]
  roasDomain?: [number, number]
}

const INK = '#1a1a1f'
const ACCENT = '#b85c3a'
const LINE = '#e9e5d9'

export function TrendChart({ title = 'Spend & ROAS, weekly', subtitle, weeks, roasDomain }: Props) {
  const maxRoas = Math.max(...weeks.map((w) => w.roas))
  const minRoas = Math.min(...weeks.map((w) => w.roas))
  const domain: [number, number] =
    roasDomain ?? [Math.max(0, Math.floor(minRoas - 0.5)), Math.ceil(maxRoas + 0.5)]

  return (
    <Panel
      title={title}
      subtitle={subtitle}
      right={
        <div className="flex gap-4 text-[11px] text-ink2">
          <Legend color={INK} label="Spend" />
          <Legend color={ACCENT} dashed label="ROAS" />
        </div>
      }
    >
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={weeks} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trend-spend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INK} stopOpacity={0.08} />
                <stop offset="100%" stopColor={INK} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={LINE} strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="p"
              stroke="#8b8b93"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: LINE }}
            />
            <YAxis
              yAxisId="left"
              stroke="#8b8b93"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v}K`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={domain}
              stroke="#8b8b93"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}×`}
            />
            <Tooltip
              cursor={{ stroke: '#b8b5a8', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{
                background: '#ffffff',
                border: `1px solid ${LINE}`,
                borderRadius: 6,
                color: INK,
                fontSize: 11,
                fontFamily: '"IBM Plex Sans", sans-serif',
                boxShadow: '0 2px 8px rgba(26,26,31,0.06)',
                padding: '8px 10px',
              }}
              labelStyle={{ color: '#51525c', fontWeight: 600, marginBottom: 4 }}
              formatter={(value: number, name: string) => {
                if (name === 'Spend') return [`$${value}K`, 'Spend']
                if (name === 'ROAS') return [`${value}×`, 'ROAS']
                return [`$${value}`, name]
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="spend"
              name="Spend"
              stroke={INK}
              strokeWidth={1.8}
              fill="url(#trend-spend-fill)"
              dot={false}
              activeDot={{ r: 4, fill: INK, stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="roas"
              name="ROAS"
              stroke={ACCENT}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{ r: 4, fill: ACCENT, stroke: '#ffffff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block w-3 h-[2px]"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)`
            : color,
        }}
      />
      <span>{label}</span>
    </span>
  )
}
