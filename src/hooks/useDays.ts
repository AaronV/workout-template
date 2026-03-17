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

  const addExerciseToDay = (exerciseId: string) => {
    if (!exerciseId) return 'missing' as const
    if (dayExerciseIds.includes(exerciseId)) return 'duplicate' as const
    if (dayExerciseIds.length >= MAX_DAY_EXERCISES) return 'full' as const

    setDayExerciseIds((currentIds) => [...currentIds, exerciseId])
    return 'added' as const
  }

  const handleAddExerciseToDay = () => {
    const result = addExerciseToDay(selectedDayExerciseId)
    if (result === 'added') {
      setSelectedDayExerciseId('')
    }
  }

  const handleRemoveExerciseFromDay = (exerciseId: string) => {
    setDayExerciseIds((currentIds) => currentIds.filter((id) => id !== exerciseId))
  }

  const handleMoveExerciseInDay = (exerciseId: string, direction: 'up' | 'down') => {
    setDayExerciseIds((currentIds) => {
      const currentIndex = currentIds.indexOf(exerciseId)
      if (currentIndex === -1) return currentIds

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (targetIndex < 0 || targetIndex >= currentIds.length) {
        return currentIds
      }

      const nextIds = [...currentIds]
      const [movedExerciseId] = nextIds.splice(currentIndex, 1)
      nextIds.splice(targetIndex, 0, movedExerciseId)
      return nextIds
    })
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

  const replaceDays = (nextDays: ExerciseDay[]) => {
    setDays(nextDays)
    resetDayForm(nextDays.length)
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
    addExerciseToDay,
    handleAddExerciseToDay,
    handleRemoveExerciseFromDay,
    handleMoveExerciseInDay,
    handleSaveDay,
    handleEditDay,
    handleOpenCreateDay,
    handleDeleteDay,
    resetDayForm,
    removeExerciseReferences,
    replaceDays,
  }
}
