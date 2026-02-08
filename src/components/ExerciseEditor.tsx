import { useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import type { Exercise } from '../types'

type ExerciseEditorProps = {
  isModalOpen: boolean
  exerciseName: string
  exerciseReps: string
  exerciseRest: string
  exerciseNotes: string
  editingExerciseId: string | null
  sortedExercises: Exercise[]
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
  sortedExercises,
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

      {sortedExercises.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No exercises yet. Add your first one above.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {sortedExercises.map((exercise) => (
            <li key={exercise.id} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-slate-900">{exercise.name}</p>
                <div className="flex gap-2">
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
              </div>
              <p className="mt-1 text-slate-600">
                Reps: {exercise.reps || '-'} | Rest: {exercise.rest || '-'}
              </p>
              {exercise.notes ? <p className="mt-1 text-slate-600">Notes: {exercise.notes}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ExerciseEditor
