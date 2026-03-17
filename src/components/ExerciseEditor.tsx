import { useState } from 'react'
import type { Exercise } from '../types'

type ExerciseEditorProps = {
  exercises: Exercise[]
  onOpenCreateExercise: () => void
  onEditExercise: (exercise: Exercise) => void
  onDeleteExercise: (exerciseId: string) => void
}

function ExerciseEditor({
  exercises,
  onOpenCreateExercise,
  onEditExercise,
  onDeleteExercise,
}: ExerciseEditorProps) {
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
