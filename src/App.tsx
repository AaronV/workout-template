import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import DayEditor from './components/DayEditor'
import ExerciseEditor from './components/ExerciseEditor'
import PrintableDayView from './components/PrintableDayView'
import { loadData, saveData } from './lib/storage'
import {
  DEFAULT_REPS,
  DEFAULT_REST,
  MAX_DAY_EXERCISES,
  type AppData,
  type Exercise,
  type ExerciseDay,
} from './types'

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function makeDayTitle(dayCount: number): string {
  return `Day ${dayCount + 1}`
}

function App() {
  const [initialData] = useState<AppData>(() => loadData())

  const [exerciseName, setExerciseName] = useState('')
  const [exerciseReps, setExerciseReps] = useState(DEFAULT_REPS)
  const [exerciseRest, setExerciseRest] = useState(DEFAULT_REST)
  const [exerciseNotes, setExerciseNotes] = useState('')
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null)

  const [exercises, setExercises] = useState<Exercise[]>(initialData.exercises)
  const [days, setDays] = useState<ExerciseDay[]>(initialData.days)

  const [dayTitle, setDayTitle] = useState(makeDayTitle(initialData.days.length))
  const [dayExerciseIds, setDayExerciseIds] = useState<string[]>([])
  const [selectedDayExerciseId, setSelectedDayExerciseId] = useState('')
  const [editingDayId, setEditingDayId] = useState<string | null>(null)
  const [selectedPrintDayId, setSelectedPrintDayId] = useState(initialData.days[0]?.id ?? '')

  const sortedExercises = [...exercises].sort((firstExercise, secondExercise) =>
    firstExercise.name.localeCompare(secondExercise.name, undefined, { sensitivity: 'base' }),
  )

  const exerciseLookup = useMemo(() => {
    return new Map(exercises.map((exercise) => [exercise.id, exercise]))
  }, [exercises])

  const printableDay = days.find((day) => day.id === selectedPrintDayId) ?? null

  useEffect(() => {
    saveData({ exercises, days })
  }, [exercises, days])

  useEffect(() => {
    setSelectedPrintDayId((currentSelectedDayId) => {
      if (days.length === 0) return ''
      if (currentSelectedDayId && days.some((day) => day.id === currentSelectedDayId)) {
        return currentSelectedDayId
      }

      return days[0].id
    })
  }, [days])

  const resetExerciseForm = () => {
    setExerciseName('')
    setExerciseReps(DEFAULT_REPS)
    setExerciseRest(DEFAULT_REST)
    setExerciseNotes('')
    setEditingExerciseId(null)
  }

  const resetDayForm = (nextDayCount: number) => {
    setDayTitle(makeDayTitle(nextDayCount))
    setDayExerciseIds([])
    setSelectedDayExerciseId('')
    setEditingDayId(null)
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

    setDays((currentDays) =>
      currentDays.map((day) => ({
        ...day,
        exerciseIds: day.exerciseIds.filter((id) => id !== exerciseId),
      })),
    )

    setDayExerciseIds((currentIds) => currentIds.filter((id) => id !== exerciseId))

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

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900 print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="no-print rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold tracking-tight">Workout Template Creator</h1>
          <p className="mt-3 text-base text-slate-600">
            Build and print your workout sheet, then fill in sets and reps at the gym.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
            <ExerciseEditor
              exerciseName={exerciseName}
              exerciseReps={exerciseReps}
              exerciseRest={exerciseRest}
              exerciseNotes={exerciseNotes}
              editingExerciseId={editingExerciseId}
              sortedExercises={sortedExercises}
              onExerciseNameChange={setExerciseName}
              onExerciseRepsChange={setExerciseReps}
              onExerciseRestChange={setExerciseRest}
              onExerciseNotesChange={setExerciseNotes}
              onSaveExercise={handleSaveExercise}
              onCancelEditExercise={resetExerciseForm}
              onEditExercise={handleEditExercise}
              onDeleteExercise={handleDeleteExercise}
            />

            <DayEditor
              dayTitle={dayTitle}
              dayExerciseIds={dayExerciseIds}
              selectedDayExerciseId={selectedDayExerciseId}
              editingDayId={editingDayId}
              days={days}
              sortedExercises={sortedExercises}
              exerciseLookup={exerciseLookup}
              maxDayExercises={MAX_DAY_EXERCISES}
              onDayTitleChange={setDayTitle}
              onSelectedDayExerciseIdChange={setSelectedDayExerciseId}
              onAddExerciseToDay={handleAddExerciseToDay}
              onRemoveExerciseFromDay={handleRemoveExerciseFromDay}
              onSaveDay={handleSaveDay}
              onCancelEditDay={() => resetDayForm(days.length)}
              onEditDay={handleEditDay}
              onDeleteDay={handleDeleteDay}
            />
          </div>
        </section>

        <PrintableDayView
          days={days}
          selectedPrintDayId={selectedPrintDayId}
          printableDay={printableDay}
          exerciseLookup={exerciseLookup}
          onSelectedPrintDayIdChange={setSelectedPrintDayId}
          onPrint={() => window.print()}
        />
      </div>
    </main>
  )
}

export default App
