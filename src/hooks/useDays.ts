import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { MAX_DAY_EXERCISES, type Exercise, type ExerciseDay } from '../types'

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function makeDayTitle(dayCount: number): string {
  return `Day ${dayCount + 1}`
}

type UseDaysOptions = {
  initialDays: ExerciseDay[]
  exercises: Exercise[]
}

export function useDays({ initialDays, exercises }: UseDaysOptions) {
  const [dayTitle, setDayTitle] = useState(makeDayTitle(initialDays.length))
  const [dayExerciseIds, setDayExerciseIds] = useState<string[]>([])
  const [selectedDayExerciseId, setSelectedDayExerciseId] = useState('')
  const [editingDayId, setEditingDayId] = useState<string | null>(null)
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [days, setDays] = useState<ExerciseDay[]>(initialDays)

  const sortedExercises = [...exercises].sort((firstExercise, secondExercise) =>
    firstExercise.name.localeCompare(secondExercise.name, undefined, { sensitivity: 'base' }),
  )

  const exerciseLookup = useMemo(() => {
    return new Map(exercises.map((exercise) => [exercise.id, exercise]))
  }, [exercises])

  const resetDayForm = (nextDayCount: number) => {
    setDayTitle(makeDayTitle(nextDayCount))
    setDayExerciseIds([])
    setSelectedDayExerciseId('')
    setEditingDayId(null)
    setIsDayModalOpen(false)
  }

  const handleAddExerciseToDay = () => {
    if (!selectedDayExerciseId) return
    if (dayExerciseIds.includes(selectedDayExerciseId)) return
    if (dayExerciseIds.length >= MAX_DAY_EXERCISES) return

    setDayExerciseIds((currentIds) => [...currentIds, selectedDayExerciseId])
    setSelectedDayExerciseId('')
  }

  const handleRemoveExerciseFromDay = (exerciseId: string) => {
    setDayExerciseIds((currentIds) => currentIds.filter((id) => id !== exerciseId))
  }

  const handleSaveDay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = dayTitle.trim()
    if (!trimmedTitle) return
    if (dayExerciseIds.length === 0) return

    const nextDay: ExerciseDay = {
      id: editingDayId ?? makeId(),
      title: trimmedTitle,
      exerciseIds: dayExerciseIds,
    }

    if (editingDayId) {
      setDays((currentDays) => {
        const nextDays = currentDays.map((day) => (day.id === editingDayId ? nextDay : day))
        resetDayForm(nextDays.length)
        return nextDays
      })
      return
    }

    setDays((currentDays) => {
      const nextDays = [...currentDays, nextDay]
      resetDayForm(nextDays.length)
      return nextDays
    })
  }

  const handleEditDay = (day: ExerciseDay) => {
    setEditingDayId(day.id)
    setDayTitle(day.title)
    setDayExerciseIds(day.exerciseIds)
    setSelectedDayExerciseId('')
    setIsDayModalOpen(true)
  }

  const handleOpenCreateDay = () => {
    resetDayForm(days.length)
    setIsDayModalOpen(true)
  }

  const handleDeleteDay = (dayId: string) => {
    setDays((currentDays) => {
      const nextDays = currentDays.filter((day) => day.id !== dayId)
      if (editingDayId === dayId) {
        resetDayForm(nextDays.length)
      }
      return nextDays
    })
  }

  const removeExerciseReferences = (exerciseId: string) => {
    setDays((currentDays) =>
      currentDays.map((day) => ({
        ...day,
        exerciseIds: day.exerciseIds.filter((id) => id !== exerciseId),
      })),
    )
    setDayExerciseIds((currentIds) => currentIds.filter((id) => id !== exerciseId))
  }

  return {
    days,
    sortedExercises,
    exerciseLookup,
    dayTitle,
    dayExerciseIds,
    selectedDayExerciseId,
    editingDayId,
    isDayModalOpen,
    setDayTitle,
    setSelectedDayExerciseId,
    handleAddExerciseToDay,
    handleRemoveExerciseFromDay,
    handleSaveDay,
    handleEditDay,
    handleOpenCreateDay,
    handleDeleteDay,
    resetDayForm,
    removeExerciseReferences,
  }
}
