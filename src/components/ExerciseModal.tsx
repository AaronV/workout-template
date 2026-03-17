import { useEffect, useRef } from 'react'
import type { FormEvent } from 'react'

type ExerciseModalProps = {
  isOpen: boolean
  exerciseName: string
  exerciseReps: string
  exerciseRest: string
  exerciseNotes: string
  editingExerciseId: string | null
  onClose: () => void
  onExerciseNameChange: (value: string) => void
  onExerciseRepsChange: (value: string) => void
  onExerciseRestChange: (value: string) => void
  onExerciseNotesChange: (value: string) => void
  onSave: (event: FormEvent<HTMLFormElement>) => void
  onCancelEdit: () => void
}

function ExerciseModal({
  isOpen,
  exerciseName,
  exerciseReps,
  exerciseRest,
  exerciseNotes,
  editingExerciseId,
  onClose,
  onExerciseNameChange,
  onExerciseRepsChange,
  onExerciseRestChange,
  onExerciseNotesChange,
  onSave,
  onCancelEdit,
}: ExerciseModalProps) {
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const input = nameInputRef.current
    if (!input) return

    input.focus()
    input.select()
  }, [isOpen, editingExerciseId])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{editingExerciseId ? 'Edit Exercise' : 'Add Exercise'}</h3>
          <button
            type="button"
            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="mt-4 space-y-3" onSubmit={onSave}>
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
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          ) : null}
        </form>
      </div>
    </div>
  )
}

export default ExerciseModal
