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

type ExerciseDraft = {
  name: string
  reps: string
  rest: string
  notes: string
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

  const saveExercise = (draft: ExerciseDraft, existingExerciseId?: string | null) => {
    const trimmedExerciseName = draft.name.trim()
    if (!trimmedExerciseName) return

    const nextExercise: Exercise = {
      id: existingExerciseId ?? makeId(),
      name: trimmedExerciseName,
      reps: draft.reps.trim(),
      rest: draft.rest.trim(),
      notes: draft.notes.trim(),
    }

    if (existingExerciseId) {
      setExercises((currentExercises) =>
        currentExercises.map((exercise) => (exercise.id === existingExerciseId ? nextExercise : exercise)),
      )
    } else {
      setExercises((currentExercises) => [...currentExercises, nextExercise])
    }

    return nextExercise
  }

  const handleSaveExercise = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const savedExercise = saveExercise(
      {
        name: exerciseName,
        reps: exerciseReps,
        rest: exerciseRest,
        notes: exerciseNotes,
      },
      editingExerciseId,
    )
    if (!savedExercise) return

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

  const handleSaveExerciseDraft = (draft: ExerciseDraft) => {
    return saveExercise(draft)
  }

  const replaceExercises = (nextExercises: Exercise[]) => {
    setExercises(nextExercises)
    resetExerciseForm()
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
    handleSaveExerciseDraft,
    replaceExercises,
    resetExerciseForm,
  }
}
