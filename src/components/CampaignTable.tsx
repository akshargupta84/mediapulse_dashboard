import type { Campaign } from '../data'

interface Props {
  campaigns: Campaign[]
  title?: string
  subtitle: string
}

export function CampaignTable({ campaigns, title = 'Top campaigns', subtitle }: Props) {
  const sorted = [...campaigns].sort((a, b) => b.roas - a.roas)
  return (
    <div className="bg-card border border-line rounded-lg shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-line flex items-start justify-between">
        <div>
          <div className="text-[13px] font-semibold text-ink">{title}</div>
          <div className="text-[11px] text-ink3 mt-0.5 font-medium">{subtitle}</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th>Campaign</Th>
              <Th>Channel</Th>
              <Th>Status</Th>
              <Th className="text-right">Spend</Th>
              <Th className="text-right">CPA</Th>
              <Th className="text-right">ROAS</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => {
              const isTop = c.roas >= 3
              const isLow = c.roas < 2
              return (
                <tr
                  key={c.name}
                  className="border-b border-line last:border-b-0 hover:bg-bg2 transition-colors"
                >
                  <td className="py-3 px-4 text-[13px]">
                    <div className="font-medium text-ink">{c.name}</div>
                    <div className="text-[11px] text-ink3 mt-px">{c.channel}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-bg2 text-ink2 text-[11px] font-medium">
                      {c.channel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-ink2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: c.status === 'Active' ? '#4a7a4c' : '#b8b5a8' }}
                      />
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right tnum text-[12px] text-ink">
                    ${c.spend}K
                  </td>
                  <td className="py-3 px-4 text-right tnum text-[12px] text-ink2">
                    ${c.cpa}
                  </td>
                  <td
                    className={`py-3 px-4 text-right tnum text-[12px] font-semibold ${
                      isTop ? 'text-up' : isLow ? 'text-down' : 'text-ink'
                    }`}
                  >
                    {c.roas}×
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-[10px] text-ink3 font-semibold text-left px-4 py-2.5 tracking-[0.06em] uppercase bg-bg2 border-b border-line ${className}`}
    >
      {children}
    </th>
  )
}
