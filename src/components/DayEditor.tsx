import type { FormEvent } from 'react'
import type { Exercise, ExerciseDay } from '../types'

type DayEditorProps = {
  dayTitle: string
  dayExerciseIds: string[]
  selectedDayExerciseId: string
  editingDayId: string | null
  days: ExerciseDay[]
  sortedExercises: Exercise[]
  exerciseLookup: Map<string, Exercise>
  maxDayExercises: number
  onDayTitleChange: (value: string) => void
  onSelectedDayExerciseIdChange: (value: string) => void
  onAddExerciseToDay: () => void
  onRemoveExerciseFromDay: (exerciseId: string) => void
  onSaveDay: (event: FormEvent<HTMLFormElement>) => void
  onCancelEditDay: () => void
  onEditDay: (day: ExerciseDay) => void
  onDeleteDay: (dayId: string) => void
}

function DayEditor({
  dayTitle,
  dayExerciseIds,
  selectedDayExerciseId,
  editingDayId,
  days,
  sortedExercises,
  exerciseLookup,
  maxDayExercises,
  onDayTitleChange,
  onSelectedDayExerciseIdChange,
  onAddExerciseToDay,
  onRemoveExerciseFromDay,
  onSaveDay,
  onCancelEditDay,
  onEditDay,
  onDeleteDay,
}: DayEditorProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Exercise Days</h2>
      <form className="mt-4 space-y-3" onSubmit={onSaveDay}>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
          name="day-title"
          placeholder="Day title"
          value={dayTitle}
          onChange={(event) => onDayTitleChange(event.target.value)}
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
            name="day-exercise"
            value={selectedDayExerciseId}
            onChange={(event) => onSelectedDayExerciseIdChange(event.target.value)}
            disabled={sortedExercises.length === 0 || dayExerciseIds.length >= maxDayExercises}
          >
            <option value="">Select exercise...</option>
            {sortedExercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onAddExerciseToDay}
            disabled={!selectedDayExerciseId || dayExerciseIds.length >= maxDayExercises}
          >
            Add to Day
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Day exercises: {dayExerciseIds.length}/{maxDayExercises}
        </p>

        {dayExerciseIds.length > 0 ? (
          <ol className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
            {dayExerciseIds.map((exerciseId, index) => {
              const exercise = exerciseLookup.get(exerciseId)
              return (
                <li key={`${exerciseId}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    {index + 1}. {exercise ? exercise.name : '[Removed exercise]'}
                  </span>
                  <button
                    type="button"
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                    onClick={() => onRemoveExerciseFromDay(exerciseId)}
                  >
                    Remove
                  </button>
                </li>
              )
            })}
          </ol>
        ) : (
          <p className="text-sm text-slate-500">No exercises selected for this day yet.</p>
        )}

        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!dayTitle.trim() || dayExerciseIds.length === 0}
        >
          {editingDayId ? 'Save Day Changes' : 'Save Day'}
        </button>
        {editingDayId ? (
          <button
            type="button"
            className="ml-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            onClick={onCancelEditDay}
          >
            Cancel
          </button>
        ) : null}
      </form>

      {days.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No days saved yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {days.map((day) => (
            <li key={day.id} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-900">{day.title}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                    onClick={() => onEditDay(day)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteDay(day.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-600">
                {day.exerciseIds.map((exerciseId, index) => {
                  const exercise = exerciseLookup.get(exerciseId)
                  return (
                    <li key={`${day.id}-${exerciseId}-${index}`}>
                      {exercise ? exercise.name : '[Removed exercise]'}
                    </li>
                  )
                })}
              </ol>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default DayEditor
