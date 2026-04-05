import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChannelMeta, PeriodData } from '../data'
import { channelWeekly, formatCount } from '../data'
import { Panel } from './Panel'

interface Props {
  period: PeriodData
}

const INK = '#1a1a1f'
const LINE = '#e9e5d9'

export function ChannelDeepDive({ period }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedName, setSelectedName] = useState<string>(period.channels[0]?.name ?? '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!period.channels.find((c) => c.name === selectedName)) {
      setSelectedName(period.channels[0]?.name ?? '')
    }
  }, [period, selectedName])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const channel: ChannelMeta =
    period.channels.find((c) => c.name === selectedName) ?? period.channels[0]

  const weekly = useMemo(
    () => channelWeekly(channel, period.weeks, period.kpis),
    [channel, period],
  )

  const channelCampaigns = period.campaigns
    .filter((c) => c.channel === channel.name)
    .sort((a, b) => b.spend - a.spend)

  const spendShare = ((channel.spend / period.kpis.spend) * 100).toFixed(1)

  const dropdown = (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3.5 py-2 text-[14px] bg-card border border-line text-ink2 hover:text-ink hover:border-line2 flex items-center gap-2 rounded-md min-w-[200px] justify-between transition-colors font-medium"
      >
        <span className="text-ink font-semibold">{channel.name}</span>
        <ChevronDown size={14} className={`text-ink3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-[240px] bg-card border border-line rounded-md shadow-card-hover p-1 z-30">
          {period.channels.map((c) => {
            const active = c.name === channel.name
            return (
              <button
                key={c.name}
                onClick={() => {
                  setSelectedName(c.name)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-[14px] flex items-center justify-between rounded transition-colors ${
                  active ? 'bg-bg2 text-ink font-semibold' : 'text-ink2 hover:bg-bg2 hover:text-ink'
                }`}
              >
                <span>{c.name}</span>
                <span className="tnum text-[13px] text-ink3">{c.roas}×</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <Panel
      title="Channel deep dive"
      subtitle={`Weekly trend + stats · ${period.label}`}
      right={dropdown}
    >
      <div className="grid grid-cols-4 max-[700px]:grid-cols-2 gap-3 mb-5">
        <Stat label="Spend" value={`$${channel.spend}K`} sub={`${spendShare}% of total`} />
        <Stat
          label="ROAS"
          value={`${channel.roas}×`}
          sub={channel.roas >= period.kpis.roas ? 'Above blended' : 'Below blended'}
        />
        <Stat label="CPA" value={`$${channel.cpa}`} sub={`${formatCount(channel.conversions)} conv`} />
        <Stat label="Impressions" value={`${channel.impressions}M`} sub={`${channel.ctr}% CTR`} />
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weekly} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="channelSpendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INK} stopOpacity={0.1} />
                <stop offset="100%" stopColor={INK} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={LINE} vertical={false} />
            <XAxis dataKey="p" stroke="#8b8b93" fontSize={12} tickLine={false} axisLine={{ stroke: LINE }} />
            <YAxis
              stroke="#8b8b93"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v}K`}
            />
            <Tooltip
              cursor={{ stroke: '#b8b5a8', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{
                background: '#ffffff',
                border: `1px solid ${LINE}`,
                borderRadius: 6,
                color: INK,
                fontSize: 13,
                fontFamily: '"IBM Plex Sans", sans-serif',
                boxShadow: '0 2px 8px rgba(26,26,31,0.06)',
              }}
              labelStyle={{ color: '#51525c', fontWeight: 600, marginBottom: 2 }}
              formatter={(value: number) => [`$${value}K`, 'Spend']}
            />
            <Area
              type="monotone"
              dataKey="spend"
              name="Spend"
              stroke={INK}
              strokeWidth={1.8}
              fill="url(#channelSpendGrad)"
              dot={false}
              activeDot={{ r: 4, fill: INK, stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {channelCampaigns.length > 0 && (
        <div className="mt-5">
          <div className="text-[13px] text-ink3 font-medium mb-2">
            Top {channel.name} campaigns
          </div>
          <div className="flex flex-col">
            {channelCampaigns.slice(0, 4).map((c, i) => (
              <div
                key={c.name}
                className={`flex justify-between items-center py-2 ${i > 0 ? 'border-t border-line' : ''}`}
              >
                <span className="text-[14px] text-ink font-medium truncate mr-3">{c.name}</span>
                <span className="flex gap-4 tnum text-[13px] flex-shrink-0">
                  <span className="text-ink2">${c.spend}K</span>
                  <span
                    className={
                      c.roas >= 3 ? 'text-up font-semibold' : c.roas < 2 ? 'text-down font-semibold' : 'text-ink font-semibold'
                    }
                  >
                    {c.roas}×
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border border-line rounded-md px-3.5 py-3 bg-bg">
      <div className="text-[12px] text-ink3 font-medium uppercase tracking-[0.03em]">{label}</div>
      <div className="text-[24px] font-semibold text-ink leading-tight mt-0.5 tnum tracking-[-0.02em]">
        {value}
      </div>
      <div className="text-[12.5px] text-ink3 mt-0.5">{sub}</div>
    </div>
  )
}
