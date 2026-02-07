import { useState } from 'react'
import type { FormEvent } from 'react'

type Exercise = {
  name: string
  reps: string
  rest: string
  notes: string
}

function App() {
  const [exerciseName, setExerciseName] = useState('')
  const [exerciseReps, setExerciseReps] = useState('')
  const [exerciseRest, setExerciseRest] = useState('')
  const [exerciseNotes, setExerciseNotes] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])

  const sortedExercises = [...exercises].sort((firstExercise, secondExercise) =>
    firstExercise.name.localeCompare(secondExercise.name, undefined, { sensitivity: 'base' }),
  )

  const handleAddExercise = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedExerciseName = exerciseName.trim()
    if (!trimmedExerciseName) return

    const newExercise: Exercise = {
      name: trimmedExerciseName,
      reps: exerciseReps.trim(),
      rest: exerciseRest.trim(),
      notes: exerciseNotes.trim(),
    }

    setExercises((currentExercises) => [...currentExercises, newExercise])
    setExerciseName('')
    setExerciseReps('')
    setExerciseRest('')
    setExerciseNotes('')
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold tracking-tight">Workout Template Creator</h1>
        <p className="mt-3 text-base text-slate-600">
          Build and print your workout sheet, then fill in sets and reps at the gym.
        </p>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Exercises</h2>
          <form className="mt-4 space-y-3" onSubmit={handleAddExercise}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 sm:col-span-2"
                name="exercise-name"
                placeholder="Exercise name (e.g. Barbell Squat)"
                value={exerciseName}
                onChange={(event) => setExerciseName(event.target.value)}
              />
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                name="exercise-reps"
                placeholder="Reps (e.g. 5x5)"
                value={exerciseReps}
                onChange={(event) => setExerciseReps(event.target.value)}
              />
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                name="exercise-rest"
                placeholder="Rest (e.g. 90 sec)"
                value={exerciseRest}
                onChange={(event) => setExerciseRest(event.target.value)}
              />
            </div>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              name="exercise-notes"
              placeholder="Notes"
              value={exerciseNotes}
              onChange={(event) => setExerciseNotes(event.target.value)}
            />
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Add Exercise
            </button>
          </form>

          {exercises.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No exercises yet. Add your first one above.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {sortedExercises.map((exercise, index) => (
                <li
                  key={`${exercise.name}-${index}`}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                >
                  <p className="font-medium text-slate-900">{exercise.name}</p>
                  <p className="mt-1 text-slate-600">
                    Reps: {exercise.reps || '-'} | Rest: {exercise.rest || '-'}
                  </p>
                  {exercise.notes ? <p className="mt-1 text-slate-600">Notes: {exercise.notes}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
