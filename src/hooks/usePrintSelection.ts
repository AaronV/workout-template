import { useMemo, useState } from 'react'
import type { ExerciseDay } from '../types'

type UsePrintSelectionOptions = {
  days: ExerciseDay[]
}

export function usePrintSelection({ days }: UsePrintSelectionOptions) {
  const [selectedPrintDayId, setSelectedPrintDayId] = useState(days[0]?.id ?? '')
  const resolvedSelectedPrintDayId =
    selectedPrintDayId && days.some((day) => day.id === selectedPrintDayId) ? selectedPrintDayId : (days[0]?.id ?? '')

  const printableDay = useMemo(() => {
    return days.find((day) => day.id === resolvedSelectedPrintDayId) ?? null
  }, [days, resolvedSelectedPrintDayId])

  return {
    selectedPrintDayId: resolvedSelectedPrintDayId,
    setSelectedPrintDayId,
    printableDay,
  }
}
