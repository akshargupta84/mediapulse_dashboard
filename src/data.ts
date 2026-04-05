// ---------------------------------------------------------------------------
// MediaPulse synthetic dataset
// Three time periods (Q3 2024, Q4 2024, Q1 2025) of realistic paid-media data
// with weekly aggregates, per-channel stats, top campaigns, and funnel stages.
// ---------------------------------------------------------------------------

export interface WeekPoint {
  p: string
  spend: number // $K
  roas: number // multiplier
  cpa: number // $
  impr: number // millions
}

export interface Campaign {
  name: string
  channel: string
  spend: number // $K
  roas: number
  cpa: number
  conversions: number
  status: 'Active' | 'Paused'
}

export interface ChannelMeta {
  name: string
  color: string
  spend: number // $K
  roas: number
  cpa: number
  conversions: number
  impressions: number // millions
  ctr: number // %
}

export interface FunnelStage {
  name: string
  value: number
  conversion: number // % from previous stage
}

export interface PeriodKPIs {
  spend: number // $K
  roas: number
  impressions: number // millions
  cpa: number // $
  conversions: number
  revenue: number // $M
}

export interface PeriodData {
  id: string
  label: string
  sublabel: string
  kpis: PeriodKPIs
  weeks: WeekPoint[]
  channels: ChannelMeta[]
  campaigns: Campaign[]
  funnel: FunnelStage[]
}

// ---------------------------------------------------------------------------
// Q1 2025 (newest, strongest — the default view)
// ---------------------------------------------------------------------------
const Q1_WEEKS: WeekPoint[] = [
  { p: 'Jan W1', spend: 42, roas: 3.1, cpa: 52, impr: 3.2 },
  { p: 'Jan W2', spend: 48, roas: 3.4, cpa: 48, impr: 3.8 },
  { p: 'Jan W3', spend: 51, roas: 3.2, cpa: 51, impr: 4.0 },
  { p: 'Jan W4', spend: 55, roas: 3.8, cpa: 43, impr: 4.3 },
  { p: 'Feb W1', spend: 58, roas: 3.6, cpa: 45, impr: 4.5 },
  { p: 'Feb W2', spend: 62, roas: 4.1, cpa: 40, impr: 4.8 },
  { p: 'Feb W3', spend: 59, roas: 3.9, cpa: 42, impr: 4.6 },
  { p: 'Feb W4', spend: 65, roas: 4.3, cpa: 38, impr: 5.1 },
  { p: 'Mar W1', spend: 70, roas: 4.0, cpa: 41, impr: 5.4 },
  { p: 'Mar W2', spend: 72, roas: 4.4, cpa: 37, impr: 5.6 },
  { p: 'Mar W3', spend: 68, roas: 4.2, cpa: 39, impr: 5.3 },
  { p: 'Mar W4', spend: 75, roas: 4.6, cpa: 35, impr: 5.8 },
]

const Q1_CHANNELS: ChannelMeta[] = [
  { name: 'Google Search', color: '#4285f4', spend: 225, roas: 4.8, cpa: 38, conversions: 5921, impressions: 15.8, ctr: 3.9 },
  { name: 'Meta Ads', color: '#1877f2', spend: 168, roas: 3.2, cpa: 55, conversions: 3054, impressions: 14.2, ctr: 1.7 },
  { name: 'YouTube', color: '#ff4444', spend: 112, roas: 2.6, cpa: 72, conversions: 1555, impressions: 9.6, ctr: 1.1 },
  { name: 'Programmatic', color: '#0ea5e9', spend: 89, roas: 2.1, cpa: 98, conversions: 908, impressions: 6.4, ctr: 0.8 },
  { name: 'LinkedIn', color: '#2563eb', spend: 56, roas: 1.8, cpa: 145, conversions: 386, impressions: 2.2, ctr: 0.6 },
]

const Q1_CAMPAIGNS: Campaign[] = [
  { name: 'Spring Promo — Search Brand', channel: 'Google Search', spend: 45.2, roas: 6.2, cpa: 28, conversions: 1614, status: 'Active' },
  { name: 'Retargeting — Meta DPA', channel: 'Meta Ads', spend: 38.1, roas: 4.1, cpa: 42, conversions: 907, status: 'Active' },
  { name: 'Performance Max — Shopping', channel: 'Google Search', spend: 34.7, roas: 5.4, cpa: 33, conversions: 1052, status: 'Active' },
  { name: 'Awareness — YouTube Bumper', channel: 'YouTube', spend: 29.8, roas: 2.3, cpa: 88, conversions: 339, status: 'Active' },
  { name: 'Programmatic Display — Retarget', channel: 'Programmatic', spend: 28.9, roas: 2.0, cpa: 102, conversions: 283, status: 'Active' },
  { name: 'Lookalike — Meta Video', channel: 'Meta Ads', spend: 26.3, roas: 3.4, cpa: 48, conversions: 548, status: 'Active' },
  { name: 'Prospecting — Search NB', channel: 'Google Search', spend: 22.4, roas: 3.5, cpa: 51, conversions: 439, status: 'Paused' },
  { name: 'In-Stream — YouTube Skippable', channel: 'YouTube', spend: 19.5, roas: 2.8, cpa: 76, conversions: 257, status: 'Paused' },
  { name: 'B2B — LinkedIn Lead Gen', channel: 'LinkedIn', spend: 18.9, roas: 1.9, cpa: 138, conversions: 137, status: 'Active' },
  { name: 'LinkedIn Sponsored Content', channel: 'LinkedIn', spend: 12.4, roas: 2.1, cpa: 129, conversions: 96, status: 'Active' },
]

const Q1_FUNNEL: FunnelStage[] = [
  { name: 'Impressions', value: 48_200_000, conversion: 100 },
  { name: 'Clicks', value: 1_204_000, conversion: 2.5 },
  { name: 'Landing Page Views', value: 998_000, conversion: 82.9 },
  { name: 'Add to Cart', value: 70_500, conversion: 7.06 },
  { name: 'Purchase', value: 11_824, conversion: 16.77 },
]

// ---------------------------------------------------------------------------
// Q4 2024 (baseline — slightly weaker across the board)
// ---------------------------------------------------------------------------
const Q4_WEEKS: WeekPoint[] = [
  { p: 'Oct W1', spend: 36, roas: 2.7, cpa: 65, impr: 2.6 },
  { p: 'Oct W2', spend: 39, roas: 2.9, cpa: 61, impr: 2.9 },
  { p: 'Oct W3', spend: 42, roas: 3.1, cpa: 58, impr: 3.2 },
  { p: 'Oct W4', spend: 45, roas: 2.8, cpa: 63, impr: 3.4 },
  { p: 'Nov W1', spend: 47, roas: 3.2, cpa: 56, impr: 3.6 },
  { p: 'Nov W2', spend: 50, roas: 3.4, cpa: 54, impr: 3.8 },
  { p: 'Nov W3', spend: 53, roas: 3.6, cpa: 51, impr: 4.0 },
  { p: 'Nov W4', spend: 56, roas: 3.0, cpa: 60, impr: 4.2 },
  { p: 'Dec W1', spend: 49, roas: 3.3, cpa: 55, impr: 3.7 },
  { p: 'Dec W2', spend: 52, roas: 3.5, cpa: 52, impr: 3.9 },
  { p: 'Dec W3', spend: 44, roas: 3.2, cpa: 57, impr: 3.3 },
  { p: 'Dec W4', spend: 36, roas: 2.9, cpa: 63, impr: 2.9 },
]

const Q4_CHANNELS: ChannelMeta[] = [
  { name: 'Google Search', color: '#4285f4', spend: 190, roas: 4.2, cpa: 44, conversions: 4318, impressions: 13.2, ctr: 3.5 },
  { name: 'Meta Ads', color: '#1877f2', spend: 142, roas: 2.8, cpa: 62, conversions: 2290, impressions: 11.8, ctr: 1.5 },
  { name: 'YouTube', color: '#ff4444', spend: 95, roas: 2.3, cpa: 81, conversions: 1173, impressions: 7.9, ctr: 1.0 },
  { name: 'Programmatic', color: '#0ea5e9', spend: 76, roas: 1.9, cpa: 108, conversions: 704, impressions: 5.3, ctr: 0.7 },
  { name: 'LinkedIn', color: '#2563eb', spend: 46, roas: 1.6, cpa: 155, conversions: 297, impressions: 1.3, ctr: 0.5 },
]

const Q4_CAMPAIGNS: Campaign[] = [
  { name: 'Holiday Push — Search Brand', channel: 'Google Search', spend: 41.5, roas: 5.6, cpa: 32, conversions: 1297, status: 'Active' },
  { name: 'BFCM Retargeting — Meta DPA', channel: 'Meta Ads', spend: 36.8, roas: 3.7, cpa: 48, conversions: 767, status: 'Active' },
  { name: 'Gift Guide — Performance Max', channel: 'Google Search', spend: 31.2, roas: 4.8, cpa: 38, conversions: 821, status: 'Active' },
  { name: 'Holiday Awareness — YouTube', channel: 'YouTube', spend: 27.4, roas: 2.1, cpa: 95, conversions: 288, status: 'Active' },
  { name: 'Cyber Week — Meta Video', channel: 'Meta Ads', spend: 24.1, roas: 3.0, cpa: 56, conversions: 430, status: 'Active' },
  { name: 'Programmatic Display — Q4', channel: 'Programmatic', spend: 26.5, roas: 1.8, cpa: 112, conversions: 237, status: 'Active' },
  { name: 'B2B Q4 — LinkedIn', channel: 'LinkedIn', spend: 16.2, roas: 1.7, cpa: 148, conversions: 109, status: 'Active' },
  { name: 'YouTube Skippable — Holiday', channel: 'YouTube', spend: 17.9, roas: 2.5, cpa: 83, conversions: 216, status: 'Paused' },
]

const Q4_FUNNEL: FunnelStage[] = [
  { name: 'Impressions', value: 39_500_000, conversion: 100 },
  { name: 'Clicks', value: 893_500, conversion: 2.26 },
  { name: 'Landing Page Views', value: 729_900, conversion: 81.7 },
  { name: 'Add to Cart', value: 49_200, conversion: 6.74 },
  { name: 'Purchase', value: 8_782, conversion: 17.85 },
]

// ---------------------------------------------------------------------------
// Q3 2024 (oldest — weakest performance, the baseline for the comeback story)
// ---------------------------------------------------------------------------
const Q3_WEEKS: WeekPoint[] = [
  { p: 'Jul W1', spend: 32, roas: 2.4, cpa: 82, impr: 2.2 },
  { p: 'Jul W2', spend: 35, roas: 2.5, cpa: 79, impr: 2.4 },
  { p: 'Jul W3', spend: 37, roas: 2.3, cpa: 84, impr: 2.5 },
  { p: 'Jul W4', spend: 39, roas: 2.6, cpa: 76, impr: 2.7 },
  { p: 'Aug W1', spend: 40, roas: 2.7, cpa: 74, impr: 2.8 },
  { p: 'Aug W2', spend: 42, roas: 2.9, cpa: 71, impr: 2.9 },
  { p: 'Aug W3', spend: 38, roas: 2.6, cpa: 77, impr: 2.6 },
  { p: 'Aug W4', spend: 41, roas: 2.8, cpa: 73, impr: 2.8 },
  { p: 'Sep W1', spend: 43, roas: 3.0, cpa: 70, impr: 3.0 },
  { p: 'Sep W2', spend: 44, roas: 2.7, cpa: 78, impr: 3.0 },
  { p: 'Sep W3', spend: 40, roas: 2.8, cpa: 75, impr: 2.7 },
  { p: 'Sep W4', spend: 37, roas: 2.6, cpa: 80, impr: 2.5 },
]

const Q3_CHANNELS: ChannelMeta[] = [
  { name: 'Google Search', color: '#4285f4', spend: 162, roas: 3.8, cpa: 52, conversions: 3115, impressions: 11.2, ctr: 3.2 },
  { name: 'Meta Ads', color: '#1877f2', spend: 122, roas: 2.4, cpa: 73, conversions: 1671, impressions: 9.9, ctr: 1.4 },
  { name: 'YouTube', color: '#ff4444', spend: 82, roas: 2.0, cpa: 92, conversions: 891, impressions: 6.6, ctr: 0.9 },
  { name: 'Programmatic', color: '#0ea5e9', spend: 65, roas: 1.7, cpa: 115, conversions: 565, impressions: 4.3, ctr: 0.6 },
  { name: 'LinkedIn', color: '#2563eb', spend: 37, roas: 1.4, cpa: 168, conversions: 220, impressions: 1.0, ctr: 0.4 },
]

const Q3_CAMPAIGNS: Campaign[] = [
  { name: 'Summer Push — Search Brand', channel: 'Google Search', spend: 36.8, roas: 5.0, cpa: 36, conversions: 1022, status: 'Active' },
  { name: 'Back-to-School — Meta DPA', channel: 'Meta Ads', spend: 31.5, roas: 3.2, cpa: 55, conversions: 573, status: 'Active' },
  { name: 'Shopping Ads — Q3', channel: 'Google Search', spend: 28.4, roas: 4.3, cpa: 42, conversions: 676, status: 'Active' },
  { name: 'Awareness — YouTube In-Stream', channel: 'YouTube', spend: 24.1, roas: 1.8, cpa: 108, conversions: 223, status: 'Active' },
  { name: 'Summer Lookalike — Meta', channel: 'Meta Ads', spend: 21.3, roas: 2.6, cpa: 64, conversions: 333, status: 'Active' },
  { name: 'Programmatic Display — Summer', channel: 'Programmatic', spend: 22.8, roas: 1.6, cpa: 121, conversions: 188, status: 'Active' },
  { name: 'B2B Summer — LinkedIn', channel: 'LinkedIn', spend: 13.7, roas: 1.5, cpa: 162, conversions: 85, status: 'Paused' },
]

const Q3_FUNNEL: FunnelStage[] = [
  { name: 'Impressions', value: 32_100_000, conversion: 100 },
  { name: 'Clicks', value: 673_300, conversion: 2.1 },
  { name: 'Landing Page Views', value: 537_600, conversion: 79.8 },
  { name: 'Add to Cart', value: 34_600, conversion: 6.43 },
  { name: 'Purchase', value: 6_462, conversion: 18.68 },
]

// ---------------------------------------------------------------------------
// PERIODS — ordered oldest → newest so [i-1] is the prior comparison period
// ---------------------------------------------------------------------------
export const PERIODS: PeriodData[] = [
  {
    id: 'q3-2024',
    label: 'Q3 2024',
    sublabel: 'Jul – Sep',
    kpis: { spend: 468, roas: 2.7, impressions: 33.0, cpa: 79, conversions: 6462, revenue: 1.26 },
    weeks: Q3_WEEKS,
    channels: Q3_CHANNELS,
    campaigns: Q3_CAMPAIGNS,
    funnel: Q3_FUNNEL,
  },
  {
    id: 'q4-2024',
    label: 'Q4 2024',
    sublabel: 'Oct – Dec',
    kpis: { spend: 549, roas: 3.1, impressions: 39.5, cpa: 66, conversions: 8782, revenue: 1.70 },
    weeks: Q4_WEEKS,
    channels: Q4_CHANNELS,
    campaigns: Q4_CAMPAIGNS,
    funnel: Q4_FUNNEL,
  },
  {
    id: 'q1-2025',
    label: 'Q1 2025',
    sublabel: 'Jan – Mar',
    kpis: { spend: 650, roas: 3.9, impressions: 48.2, cpa: 55, conversions: 11824, revenue: 2.54 },
    weeks: Q1_WEEKS,
    channels: Q1_CHANNELS,
    campaigns: Q1_CAMPAIGNS,
    funnel: Q1_FUNNEL,
  },
]

export const DEFAULT_PERIOD_ID = 'q1-2025'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getPeriod(id: string): PeriodData {
  return PERIODS.find((p) => p.id === id) ?? PERIODS[PERIODS.length - 1]
}

export function getPreviousPeriod(id: string): PeriodData | undefined {
  const i = PERIODS.findIndex((p) => p.id === id)
  if (i <= 0) return undefined
  return PERIODS[i - 1]
}

export interface DeltaInfo {
  text: string
  dir: 'up' | 'down'
  positive: boolean // true if the change is good for this metric
}

/** Format a delta between current and previous values. `lowerIsBetter` flips the "positive" flag for metrics like CPA. */
export function kpiDelta(
  current: number,
  previous: number | undefined,
  format: 'pct' | 'x' | 'dollar',
  lowerIsBetter = false,
): DeltaInfo {
  if (previous == null) return { text: '—', dir: 'up', positive: true }
  const diff = current - previous
  const dir: 'up' | 'down' = diff >= 0 ? 'up' : 'down'
  const positive = lowerIsBetter ? diff < 0 : diff >= 0
  let text: string
  if (format === 'pct') {
    const pct = (diff / previous) * 100
    text = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`
  } else if (format === 'x') {
    text = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}×`
  } else {
    text = `${diff >= 0 ? '+$' : '−$'}${Math.abs(diff).toFixed(0)}`
  }
  return { text, dir, positive }
}

/** Synthesize a weekly trend for a specific channel by scaling the period's aggregate weeks against the channel's share and performance ratios. Deterministic given the same inputs. */
export function channelWeekly(channel: ChannelMeta, aggregateWeeks: WeekPoint[], periodKpis: PeriodKPIs): WeekPoint[] {
  const spendShare = channel.spend / periodKpis.spend
  const roasRatio = channel.roas / periodKpis.roas
  const cpaRatio = channel.cpa / periodKpis.cpa
  const imprShare = channel.impressions / periodKpis.impressions
  // Per-channel noise keyed on the name so each channel has its own curve.
  const seed = [...channel.name].reduce((a, c) => a + c.charCodeAt(0), 0)
  return aggregateWeeks.map((w, i) => {
    const noise = 1 + Math.sin((i + seed) * 0.9) * 0.09
    return {
      p: w.p,
      spend: +(w.spend * spendShare * noise).toFixed(1),
      roas: +(w.roas * roasRatio * noise).toFixed(2),
      cpa: +(w.cpa * cpaRatio * (2 - noise)).toFixed(0),
      impr: +(w.impr * imprShare * noise).toFixed(2),
    }
  })
}

// ---------------------------------------------------------------------------
// Pretty formatters used across the UI
// ---------------------------------------------------------------------------
export function formatSpend(value: number): string {
  // value is in $K
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}M`
  return `$${Math.round(value)}K`
}

export function formatImpressions(valueM: number): string {
  // value in millions
  if (valueM >= 1000) return `${(valueM / 1000).toFixed(1)}B`
  return `${valueM.toFixed(1)}M`
}

export function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value.toLocaleString()
}

export function formatLongCount(value: number): string {
  return value.toLocaleString()
}

// ---------------------------------------------------------------------------
// AI Analyst context — includes the FULL dataset across every period so the
// model can answer cross-quarter questions (trends, comparisons, growth, etc.)
// regardless of which period the user happens to be viewing on-screen.
// ---------------------------------------------------------------------------
function renderPeriodBlock(p: PeriodData, isCurrent: boolean): string[] {
  const header = isCurrent
    ? `===== ${p.label} (${p.sublabel})  ◀ currently viewing on screen =====`
    : `===== ${p.label} (${p.sublabel}) =====`
  return [
    header,
    `Portfolio: $${p.kpis.spend}K spend · ${p.kpis.roas}× ROAS · ${p.kpis.impressions}M impr · $${p.kpis.cpa} CPA · ${p.kpis.conversions.toLocaleString()} conv · $${p.kpis.revenue}M revenue`,
    `Channels:`,
    ...p.channels.map(
      (c) =>
        `  • ${c.name}: $${c.spend}K spend | ${c.roas}× ROAS | $${c.cpa} CPA | ${c.conversions.toLocaleString()} conv | ${c.impressions}M impr | ${c.ctr}% CTR`,
    ),
    `Weekly (spend $K / ROAS × / CPA $ / impr M):`,
    ...p.weeks.map(
      (w) => `  • ${w.p}: $${w.spend}K · ${w.roas}× · $${w.cpa} · ${w.impr}M`,
    ),
    `Campaigns:`,
    ...p.campaigns.map(
      (c) =>
        `  • ${c.name} [${c.channel}]: $${c.spend}K · ${c.roas}× · $${c.cpa} CPA · ${c.conversions.toLocaleString()} conv · ${c.status}`,
    ),
    `Funnel:`,
    ...p.funnel.map(
      (s) => `  • ${s.name}: ${s.value.toLocaleString()} (${s.conversion}% from previous)`,
    ),
    ``,
  ]
}

export function buildAnalystContext(currentPeriod: PeriodData): string {
  const intro: string[] = [
    `ROLE`,
    `You are the media analytics and data science professional responsible for providing insights and recommendations that in turn help improve media efficiency in the short as well as the long term. You also help users understand data when necessary, and extract the most useful insights and communicate them to media practitioners in the most helpful way.`,
    ``,
    `You are embedded in MediaPulse, a paid-media analytics dashboard, and you have access to the full portfolio across every tracked quarter (weekly trends, per-channel performance, every campaign, and the conversion funnel). The dashboard on screen is currently showing ${currentPeriod.label} (${currentPeriod.sublabel}), but the complete dataset for every period is provided to you below. You may answer questions about any quarter, compare across quarters, discuss trends or growth, and call out cross-period patterns — even if the user is viewing a different one.`,
    ``,
    `HOW TO ANSWER`,
    `• Lead with the answer. Don't warm up with throat-clearing or restate the question.`,
    `• Ground every claim in specific numbers from the dataset (e.g. "Meta ROAS rose from 2.4× in Q3 to 3.2× in Q1, a +33% lift on $46K more spend"). Precise numbers > vague adjectives.`,
    `• Where it helps, structure the answer with a short summary sentence followed by a tight bulleted breakdown. Use • for bullets.`,
    `• Call out both the observation AND the "so what" — what should a media practitioner actually do about it. Recommendations should be concrete (channel, direction, rough magnitude).`,
    `• Distinguish short-term tactical moves (this week / next 2 weeks) from longer-term strategic shifts (next quarter / next year) when relevant.`,
    `• If the user is new to a concept (ROAS, CPA, blended vs. incremental, etc.), briefly explain it in plain language before diving in.`,
    `• If the data is genuinely ambiguous or a claim can't be made with confidence, say so — don't invent certainty.`,
    `• When the user says "this period" or references on-screen numbers, assume they mean ${currentPeriod.label} unless they say otherwise.`,
    `• For trend, growth, YoY, or cross-quarter questions, freely pull from all three quarters.`,
    `• Keep responses tight — aim for 120–250 words for most questions, more only when the question genuinely requires it.`,
    ``,
    `FULL DATASET — ${PERIODS.length} quarters, ordered oldest → newest:`,
    ``,
  ]
  const blocks = PERIODS.flatMap((p) => renderPeriodBlock(p, p.id === currentPeriod.id))
  return [...intro, ...blocks].join('\n')
}
