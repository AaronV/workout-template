import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Exercise } from '../types'

type ExerciseEditorProps = {
  isModalOpen: boolean
  exerciseName: string
  exerciseReps: string
  exerciseRest: string
  exerciseNotes: string
  editingExerciseId: string | null
  exercises: Exercise[]
  onOpenCreateExercise: () => void
  onCloseExerciseModal: () => void
  onExerciseNameChange: (value: string) => void
  onExerciseRepsChange: (value: string) => void
  onExerciseRestChange: (value: string) => void
  onExerciseNotesChange: (value: string) => void
  onSaveExercise: (event: FormEvent<HTMLFormElement>) => void
  onCancelEditExercise: () => void
  onEditExercise: (exercise: Exercise) => void
  onDeleteExercise: (exerciseId: string) => void
}

function ExerciseEditor({
  isModalOpen,
  exerciseName,
  exerciseReps,
  exerciseRest,
  exerciseNotes,
  editingExerciseId,
  exercises,
  onOpenCreateExercise,
  onCloseExerciseModal,
  onExerciseNameChange,
  onExerciseRepsChange,
  onExerciseRestChange,
  onExerciseNotesChange,
  onSaveExercise,
  onCancelEditExercise,
  onEditExercise,
  onDeleteExercise,
}: ExerciseEditorProps) {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredExercises = exercises.filter((exercise) => {
    if (!normalizedQuery) return true
    return [exercise.name, exercise.reps, exercise.rest, exercise.notes]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
  })
  const sortedFilteredExercises = [...filteredExercises].sort((firstExercise, secondExercise) =>
    firstExercise.name.localeCompare(secondExercise.name, undefined, { sensitivity: 'base' }),
  )

  useEffect(() => {
    if (!isModalOpen) return

    const input = nameInputRef.current
    if (!input) return

    input.focus()
    input.select()
  }, [isModalOpen, editingExerciseId])

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Exercises</h2>
        <button
          type="button"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          onClick={onOpenCreateExercise}
        >
          Add Exercise
        </button>
      </div>
      <input
        className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
        placeholder="Quick search (name, reps, rest, notes)"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{editingExerciseId ? 'Edit Exercise' : 'Add Exercise'}</h3>
              <button
                type="button"
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                onClick={onCloseExerciseModal}
              >
                Close
              </button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={onSaveExercise}>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  ref={nameInputRef}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 sm:col-span-2"
                  name="exercise-name"
                  placeholder="Exercise name (e.g. Barbell Squat)"
                  value={exerciseName}
                  onChange={(event) => onExerciseNameChange(event.target.value)}
                />
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                  name="exercise-reps"
                  placeholder="Reps (e.g. 5x5)"
                  value={exerciseReps}
                  onChange={(event) => onExerciseRepsChange(event.target.value)}
                />
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                  name="exercise-rest"
                  placeholder="Rest (e.g. 90 sec)"
                  value={exerciseRest}
                  onChange={(event) => onExerciseRestChange(event.target.value)}
                />
              </div>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                name="exercise-notes"
                placeholder="Notes"
                value={exerciseNotes}
                onChange={(event) => onExerciseNotesChange(event.target.value)}
              />
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                {editingExerciseId ? 'Save Exercise' : 'Add Exercise'}
              </button>
              {editingExerciseId ? (
                <button
                  type="button"
                  className="ml-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={onCancelEditExercise}
                >
                  Cancel
                </button>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}

      {exercises.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No exercises yet. Add your first one above.</p>
      ) : filteredExercises.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No exercises match your search.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-md border border-slate-200">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left font-semibold">Name</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left font-semibold">Reps</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left font-semibold">Rest</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left font-semibold">Notes</th>
                <th className="border-b border-slate-200 px-3 py-2 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedFilteredExercises.map((exercise) => (
                <tr key={exercise.id} className="odd:bg-white even:bg-slate-50">
                  <td className="border-b border-slate-200 px-3 py-2 text-slate-900">{exercise.name}</td>
                  <td className="border-b border-slate-200 px-3 py-2 text-slate-700">{exercise.reps || '-'}</td>
                  <td className="border-b border-slate-200 px-3 py-2 text-slate-700">{exercise.rest || '-'}</td>
                  <td className="border-b border-slate-200 px-3 py-2 text-slate-700">{exercise.notes || '-'}</td>
                  <td className="border-b border-slate-200 px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                        onClick={() => onEditExercise(exercise)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                        onClick={() => onDeleteExercise(exercise.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ExerciseEditor
