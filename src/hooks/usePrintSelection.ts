import { useEffect, useMemo, useState } from 'react'
import type { ExerciseDay } from '../types'

type UsePrintSelectionOptions = {
  days: ExerciseDay[]
}

export function usePrintSelection({ days }: UsePrintSelectionOptions) {
  const [selectedPrintDayId, setSelectedPrintDayId] = useState(days[0]?.id ?? '')

  useEffect(() => {
    setSelectedPrintDayId((currentSelectedDayId) => {
      if (days.length === 0) return ''
      if (currentSelectedDayId && days.some((day) => day.id === currentSelectedDayId)) {
        return currentSelectedDayId
      }

      return days[0].id
    })
  }, [days])

  const printableDay = useMemo(() => {
    return days.find((day) => day.id === selectedPrintDayId) ?? null
  }, [days, selectedPrintDayId])

  return {
    selectedPrintDayId,
    setSelectedPrintDayId,
    printableDay,
  }
}
