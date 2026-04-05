import { BarChart3, Filter, Layers } from 'lucide-react'
import { useState } from 'react'
import { AIAnalyst } from './components/AIAnalyst'
import { CampaignTable } from './components/CampaignTable'
import { ChannelDeepDive } from './components/ChannelDeepDive'
import { ChannelPanel } from './components/ChannelPanel'
import { FunnelChart } from './components/FunnelChart'
import { KPICard } from './components/KPICard'
import { PeriodSelector } from './components/PeriodSelector'
import { Tabs, type TabDef } from './components/Tabs'
import { TrendChart } from './components/TrendChart'
import { PeriodProvider, usePeriod } from './PeriodContext'
import { AnalystProvider } from './AnalystContext'
import { formatSpend, kpiDelta } from './data'

const TABS: TabDef[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3,
    description: 'KPI snapshot, weekly performance trend, top channels and campaigns.',
    fkey: 'F1',
  },
  {
    id: 'channels',
    label: 'Channels',
    icon: Filter,
    description:
      'Deep-dive into any single channel — pick one from the dropdown to see its weekly trend, stats and top campaigns.',
    fkey: 'F2',
  },
  {
    id: 'funnel',
    label: 'Funnel',
    icon: Layers,
    description: 'From impression to purchase — where users convert and where they drop off.',
    fkey: 'F3',
  },
]

function Dashboard() {
  const [tab, setTab] = useState<string>('overview')
  const { period, previous } = usePeriod()

  const spendDelta = kpiDelta(period.kpis.spend, previous?.kpis.spend, 'pct')
  const roasDelta = kpiDelta(period.kpis.roas, previous?.kpis.roas, 'x')
  const imprDelta = kpiDelta(period.kpis.impressions, previous?.kpis.impressions, 'pct')
  const cpaDelta = kpiDelta(period.kpis.cpa, previous?.kpis.cpa, 'dollar', true)

  const deltaLabel = previous ? `vs ${previous.label}` : 'no prior period'

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* Top bar */}
      <header className="border-b border-line bg-bg sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-7 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-accent rounded-sm" />
            <span className="text-[15px] font-semibold text-ink tracking-[-0.01em]">
              MediaPulse
            </span>
            <span className="hidden lg:inline text-[13.5px] text-ink2 font-medium border-l border-line pl-2.5 ml-0.5">
              Paid-media analytics with an embedded Claude analyst · demo dataset
            </span>
          </div>
          <nav className="flex gap-1 ml-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-bg2 text-ink'
                    : 'text-ink2 hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 bg-bg2 border border-line rounded-md px-3 py-1.5 text-[12px] text-ink3 min-w-[220px]">
            <span>Search campaigns…</span>
            <span className="flex-1" />
            <kbd className="font-mono text-[10px] bg-card border border-line rounded px-1 py-px">
              ⌘K
            </kbd>
          </div>
          <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-[11px] font-semibold">
            AG
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-7 pb-12">
        {/* Title row */}
        <div className="pt-7 pb-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold tracking-[-0.015em] m-0">
              {TABS.find((t) => t.id === tab)?.label}
            </h1>
            <div className="text-[14px] text-ink3 mt-1.5">
              {TABS.find((t) => t.id === tab)?.description}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <PeriodSelector />
            <button className="px-3 py-1.5 text-[12px] bg-card border border-line rounded-md text-ink2 hover:text-ink hover:border-line2 font-medium transition-colors">
              Export
            </button>
          </div>
        </div>

        <Tabs tabs={TABS} activeId={tab} onChange={setTab} />

        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1 gap-3 mb-4">
              <KPICard
                id="spend"
                label="Total spend"
                value={formatSpend(period.kpis.spend)}
                delta={spendDelta.text}
                deltaLabel={deltaLabel}
                dir={spendDelta.dir}
                positive={spendDelta.positive}
                accent="ink"
                data={period.weeks.map((w) => w.spend)}
              />
              <KPICard
                id="roas"
                label="Blended ROAS"
                value={`${period.kpis.roas}×`}
                delta={roasDelta.text}
                deltaLabel={deltaLabel}
                dir={roasDelta.dir}
                positive={roasDelta.positive}
                accent="accent"
                data={period.weeks.map((w) => w.roas)}
              />
              <KPICard
                id="impr"
                label="Impressions"
                value={`${period.kpis.impressions.toFixed(1)}M`}
                delta={imprDelta.text}
                deltaLabel={deltaLabel}
                dir={imprDelta.dir}
                positive={imprDelta.positive}
                accent="sage"
                data={period.weeks.map((w) => w.impr)}
              />
              <KPICard
                id="cpa"
                label="Avg CPA"
                value={`$${period.kpis.cpa}`}
                delta={cpaDelta.text}
                deltaLabel={deltaLabel}
                dir={cpaDelta.dir}
                positive={cpaDelta.positive}
                accent="ink"
                data={period.weeks.map((w) => w.cpa)}
              />
            </div>

            <div className="grid grid-cols-[1fr_370px] max-[1100px]:grid-cols-1 gap-3 mb-3">
              <TrendChart
                subtitle={`Weekly ROAS, spend and CPA · ${period.label}`}
                weeks={period.weeks}
              />
              <AIAnalyst />
            </div>

            <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-3">
              <ChannelPanel period={period} />
              <CampaignTable
                campaigns={period.campaigns}
                subtitle={`Sorted by ROAS · ${period.label}`}
              />
            </div>
          </>
        )}

        {tab === 'channels' && (
          <>
            <div className="mb-3">
              <ChannelDeepDive period={period} />
            </div>
            <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-3">
              <ChannelPanel period={period} />
              <CampaignTable
                campaigns={period.campaigns}
                subtitle={`All campaigns · ${period.label}`}
              />
            </div>
          </>
        )}

        {tab === 'funnel' && (
          <div className="grid grid-cols-[1fr_440px] max-[1100px]:grid-cols-1 gap-3">
            <FunnelChart period={period} />
            <div className="flex flex-col gap-3">
              <FunnelGuide />
              <CampaignTable
                campaigns={period.campaigns.slice(0, 6)}
                title="Revenue drivers"
                subtitle={`Top campaigns by spend · ${period.label}`}
              />
            </div>
          </div>
        )}

        <div className="mt-10 pt-4 border-t border-line flex justify-between text-[12px] text-ink3">
          <span>Last sync 14:22 UTC · auto-refresh 5m</span>
          <span>MediaPulse · {period.label}</span>
        </div>
      </main>
    </div>
  )
}

function FunnelGuide() {
  const rows: Array<[string, string, string]> = [
    ['01', 'Impressions', 'Total times an ad was shown across all channels.'],
    ['02', 'Clicks', 'Users who clicked through to the landing page.'],
    ['03', 'LP views', 'The page actually loaded — accounts for bounces.'],
    ['04', 'Add to cart', 'Strong purchase-intent signal.'],
    ['05', 'Purchase', 'Completed checkout. This is what ROAS is built on.'],
  ]
  return (
    <div className="bg-card border border-line rounded-lg shadow-card p-5">
      <div className="mb-4">
        <div className="text-[13px] font-semibold text-ink">How to read the funnel</div>
        <div className="text-[11px] text-ink3 mt-0.5 font-medium">A quick primer</div>
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map(([n, name, desc]) => (
          <div key={n} className="flex gap-3 text-[12.5px] leading-[1.55]">
            <span className="text-ink3 tnum flex-shrink-0 font-medium">{n}</span>
            <div>
              <span className="text-ink font-semibold">{name}</span>
              <span className="text-ink2"> — {desc}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-line text-[11.5px] text-ink3 leading-relaxed">
        The percentages on the funnel show conversion rate from the previous stage. Big drop-offs are
        the best places to test fixes.
      </div>
    </div>
  )
}

export default function App() {
  return (
    <PeriodProvider>
      <AnalystProvider>
        <Dashboard />
      </AnalystProvider>
    </PeriodProvider>
  )
}
