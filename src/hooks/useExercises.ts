import { useState } from 'react'
import type { FormEvent } from 'react'
import { DEFAULT_REPS, DEFAULT_REST, type Exercise } from '../types'

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

type UseExercisesOptions = {
  initialExercises: Exercise[]
}

export function useExercises({ initialExercises }: UseExercisesOptions) {
  const [exerciseName, setExerciseName] = useState('')
  const [exerciseReps, setExerciseReps] = useState(DEFAULT_REPS)
  const [exerciseRest, setExerciseRest] = useState(DEFAULT_REST)
  const [exerciseNotes, setExerciseNotes] = useState('')
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null)
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false)
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)

  const resetExerciseForm = () => {
    setExerciseName('')
    setExerciseReps(DEFAULT_REPS)
    setExerciseRest(DEFAULT_REST)
    setExerciseNotes('')
    setEditingExerciseId(null)
    setIsExerciseModalOpen(false)
  }

  const handleSaveExercise = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedExerciseName = exerciseName.trim()
    if (!trimmedExerciseName) return

    const nextExercise: Exercise = {
      id: editingExerciseId ?? makeId(),
      name: trimmedExerciseName,
      reps: exerciseReps.trim(),
      rest: exerciseRest.trim(),
      notes: exerciseNotes.trim(),
    }

    if (editingExerciseId) {
      setExercises((currentExercises) =>
        currentExercises.map((exercise) => (exercise.id === editingExerciseId ? nextExercise : exercise)),
      )
    } else {
      setExercises((currentExercises) => [...currentExercises, nextExercise])
    }

    resetExerciseForm()
  }

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises((currentExercises) => currentExercises.filter((exercise) => exercise.id !== exerciseId))
    if (editingExerciseId === exerciseId) {
      resetExerciseForm()
    }
  }

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExerciseId(exercise.id)
    setExerciseName(exercise.name)
    setExerciseReps(exercise.reps)
    setExerciseRest(exercise.rest)
    setExerciseNotes(exercise.notes)
    setIsExerciseModalOpen(true)
  }

  const handleOpenCreateExercise = () => {
    resetExerciseForm()
    setIsExerciseModalOpen(true)
  }

  return {
    exercises,
    isExerciseModalOpen,
    exerciseName,
    exerciseReps,
    exerciseRest,
    exerciseNotes,
    editingExerciseId,
    setExerciseName,
    setExerciseReps,
    setExerciseRest,
    setExerciseNotes,
    handleSaveExercise,
    handleDeleteExercise,
    handleEditExercise,
    handleOpenCreateExercise,
    resetExerciseForm,
  }
}
