import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_PERIOD_ID, PERIODS, getPeriod, getPreviousPeriod, type PeriodData } from './data'

interface PeriodContextValue {
  periodId: string
  period: PeriodData
  previous: PeriodData | undefined
  setPeriodId: (id: string) => void
  allPeriods: PeriodData[]
}

const PeriodContext = createContext<PeriodContextValue | null>(null)

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [periodId, setPeriodId] = useState<string>(DEFAULT_PERIOD_ID)
  const value = useMemo<PeriodContextValue>(() => {
    const period = getPeriod(periodId)
    const previous = getPreviousPeriod(periodId)
    return { periodId, period, previous, setPeriodId, allPeriods: PERIODS }
  }, [periodId])
  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>
}

export function usePeriod(): PeriodContextValue {
  const ctx = useContext(PeriodContext)
  if (!ctx) throw new Error('usePeriod must be used inside PeriodProvider')
  return ctx
}
