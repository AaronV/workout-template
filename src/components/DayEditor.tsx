import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Exercise, ExerciseDay } from '../types'

type DayEditorProps = {
  isModalOpen: boolean
  dayTitle: string
  dayExerciseIds: string[]
  selectedDayExerciseId: string
  editingDayId: string | null
  days: ExerciseDay[]
  sortedExercises: Exercise[]
  exerciseLookup: Map<string, Exercise>
  isQuickAddExerciseOpen: boolean
  quickAddExerciseName: string
  quickAddExerciseReps: string
  quickAddExerciseRest: string
  quickAddExerciseNotes: string
  quickAddExerciseFeedback: string
  onOpenCreateDay: () => void
  onCloseDayModal: () => void
  onDayTitleChange: (value: string) => void
  onSelectedDayExerciseIdChange: (value: string) => void
  onAddExerciseToDay: () => void
  onRemoveExerciseFromDay: (exerciseId: string) => void
  onMoveExerciseInDay: (exerciseId: string, direction: 'up' | 'down') => void
  onOpenQuickAddExercise: () => void
  onCloseQuickAddExercise: () => void
  onQuickAddExerciseNameChange: (value: string) => void
  onQuickAddExerciseRepsChange: (value: string) => void
  onQuickAddExerciseRestChange: (value: string) => void
  onQuickAddExerciseNotesChange: (value: string) => void
  onSaveExerciseFromDay: () => void
  onEditExerciseFromDay: (exerciseId: string) => void
  onSaveDay: (event: FormEvent<HTMLFormElement>) => void
  onCancelEditDay: () => void
  onEditDay: (day: ExerciseDay) => void
  onDeleteDay: (dayId: string) => void
  onPrintDay: (dayId: string) => void
}

function DayEditor({
  isModalOpen,
  dayTitle,
  dayExerciseIds,
  selectedDayExerciseId,
  editingDayId,
  days,
  sortedExercises,
  exerciseLookup,
  isQuickAddExerciseOpen,
  quickAddExerciseName,
  quickAddExerciseReps,
  quickAddExerciseRest,
  quickAddExerciseNotes,
  quickAddExerciseFeedback,
  onOpenCreateDay,
  onCloseDayModal,
  onDayTitleChange,
  onSelectedDayExerciseIdChange,
  onAddExerciseToDay,
  onRemoveExerciseFromDay,
  onMoveExerciseInDay,
  onOpenQuickAddExercise,
  onCloseQuickAddExercise,
  onQuickAddExerciseNameChange,
  onQuickAddExerciseRepsChange,
  onQuickAddExerciseRestChange,
  onQuickAddExerciseNotesChange,
  onSaveExerciseFromDay,
  onEditExerciseFromDay,
  onSaveDay,
  onCancelEditDay,
  onEditDay,
  onDeleteDay,
  onPrintDay,
}: DayEditorProps) {
  const [exerciseSearch, setExerciseSearch] = useState('')
  const isSelectedExerciseEditable = Boolean(selectedDayExerciseId && exerciseLookup.has(selectedDayExerciseId))
  const isQuickAddSaveDisabled = !quickAddExerciseName.trim()
  const isSavingDisabled = !dayTitle.trim() || dayExerciseIds.length === 0
  const availableExercises = useMemo(
    () => sortedExercises.filter((exercise) => !dayExerciseIds.includes(exercise.id)),
    [dayExerciseIds, sortedExercises],
  )
  const matchingExercises = useMemo(() => {
    const normalizedSearch = exerciseSearch.trim().toLowerCase()
    if (!normalizedSearch) {
      return availableExercises.slice(0, 8)
    }

    return availableExercises
      .filter((exercise) => exercise.name.toLowerCase().includes(normalizedSearch))
      .slice(0, 8)
  }, [availableExercises, exerciseSearch])

  useEffect(() => {
    if (!selectedDayExerciseId) {
      setExerciseSearch('')
      return
    }

    const selectedExercise = exerciseLookup.get(selectedDayExerciseId)
    setExerciseSearch(selectedExercise?.name ?? '')
  }, [exerciseLookup, selectedDayExerciseId])

  const renderDayForm = () => (
    <form className="mt-4 space-y-3" onSubmit={onSaveDay}>
      <input
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
        name="day-title"
        placeholder="Day title"
        value={dayTitle}
        onChange={(event) => onDayTitleChange(event.target.value)}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1 space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="w-full">
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                name="day-exercise-search"
                placeholder={
                  availableExercises.length === 0 ? 'All exercises already added' : 'Search exercises to add...'
                }
                value={exerciseSearch}
                onChange={(event) => {
                  const nextValue = event.target.value
                  setExerciseSearch(nextValue)

                  const exactMatch = availableExercises.find(
                    (exercise) => exercise.name.toLowerCase() === nextValue.trim().toLowerCase(),
                  )
                  onSelectedDayExerciseIdChange(exactMatch?.id ?? '')
                }}
                disabled={availableExercises.length === 0}
              />

              {availableExercises.length > 0 ? (
                <div className="mt-2 max-h-44 overflow-y-auto rounded-md border border-slate-200 bg-white">
                  {matchingExercises.length > 0 ? (
                    matchingExercises.map((exercise) => (
                      <button
                        key={exercise.id}
                        type="button"
                        className={`block w-full px-3 py-2 text-left text-sm ${
                          selectedDayExerciseId === exercise.id
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        onClick={() => {
                          onSelectedDayExerciseIdChange(exercise.id)
                          setExerciseSearch(exercise.name)
                        }}
                      >
                        {exercise.name}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-slate-500">No matching exercises.</p>
                  )}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onAddExerciseToDay}
              disabled={!selectedDayExerciseId}
            >
              Add to Day
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={isQuickAddExerciseOpen ? onCloseQuickAddExercise : onOpenQuickAddExercise}
            >
              {isQuickAddExerciseOpen ? 'Hide Quick Add' : 'Quick Add Exercise'}
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => onEditExerciseFromDay(selectedDayExerciseId)}
              disabled={!isSelectedExerciseEditable}
            >
              Edit Selected Exercise
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500">Day exercises: {dayExerciseIds.length}</p>

      {isQuickAddExerciseOpen ? (
        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-slate-900">Quick Add Exercise</h4>
            <button
              type="button"
              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-white"
              onClick={onCloseQuickAddExercise}
            >
              Close
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 sm:col-span-2"
              placeholder="Exercise name"
              value={quickAddExerciseName}
              onChange={(event) => onQuickAddExerciseNameChange(event.target.value)}
            />
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              placeholder="Reps"
              value={quickAddExerciseReps}
              onChange={(event) => onQuickAddExerciseRepsChange(event.target.value)}
            />
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              placeholder="Rest"
              value={quickAddExerciseRest}
              onChange={(event) => onQuickAddExerciseRestChange(event.target.value)}
            />
          </div>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
            placeholder="Notes"
            value={quickAddExerciseNotes}
            onChange={(event) => onQuickAddExerciseNotesChange(event.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onSaveExerciseFromDay}
              disabled={isQuickAddSaveDisabled}
            >
              Save and Add to Day
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
              onClick={onCloseQuickAddExercise}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {quickAddExerciseFeedback ? <p className="text-sm text-amber-700">{quickAddExerciseFeedback}</p> : null}

      {dayExerciseIds.length > 0 ? (
        <ol className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
          {dayExerciseIds.map((exerciseId, index) => {
            const exercise = exerciseLookup.get(exerciseId)
            const isFirstExercise = index === 0
            const isLastExercise = index === dayExerciseIds.length - 1
            return (
              <li key={`${exerciseId}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="min-w-0 flex-1">
                    {index + 1}. {exercise ? exercise.name : '[Removed exercise]'}
                  </span>
                  {exercise?.notes ? (
                    <span className="max-w-xs truncate text-right text-xs text-slate-500">{exercise.notes}</span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onMoveExerciseInDay(exerciseId, 'up')}
                    disabled={isFirstExercise}
                    aria-label={`Move ${exercise ? exercise.name : 'exercise'} up`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onMoveExerciseInDay(exerciseId, 'down')}
                    disabled={isLastExercise}
                    aria-label={`Move ${exercise ? exercise.name : 'exercise'} down`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-white"
                    onClick={() => onEditExerciseFromDay(exerciseId)}
                    disabled={!exercise}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                    onClick={() => onRemoveExerciseFromDay(exerciseId)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="text-sm text-slate-500">No exercises selected for this day yet.</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSavingDisabled}
        >
          {editingDayId ? 'Save Day Changes' : 'Save Day'}
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          onClick={onCancelEditDay}
        >
          {editingDayId ? 'Cancel' : 'Close'}
        </button>
      </div>
    </form>
  )

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Exercise Days</h2>
        <button
          type="button"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          onClick={onOpenCreateDay}
        >
          Add Day
        </button>
      </div>

      {isModalOpen && !editingDayId ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">New Day</h3>
              <p className="text-sm text-slate-500">Build a day here, then save it to your list below.</p>
            </div>
            <button
              type="button"
              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
              onClick={onCloseDayModal}
            >
              Close
            </button>
          </div>

          {renderDayForm()}
        </div>
      ) : null}

      {days.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No days saved yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {days.map((day) => (
            <li key={day.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{day.title}</p>
                  <p className="text-xs text-slate-500">
                    {day.exerciseIds.length} {day.exerciseIds.length === 1 ? 'exercise' : 'exercises'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                    onClick={() => onPrintDay(day.id)}
                  >
                    Print
                  </button>
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

              {editingDayId === day.id ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-900">Editing this day inline</p>
                  {renderDayForm()}
                </div>
              ) : (
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
                  {day.exerciseIds.map((exerciseId, index) => {
                    const exercise = exerciseLookup.get(exerciseId)
                    return (
                      <li key={`${day.id}-${exerciseId}-${index}`}>
                        <div className="flex items-center gap-3">
                          <p className="min-w-0">{exercise ? exercise.name : '[Removed exercise]'}</p>
                          {exercise?.notes ? (
                            <p className="min-w-0 truncate text-xs text-slate-500">{exercise.notes}</p>
                          ) : null}
                        </div>
                      </li>
                    )
                  })}
                </ol>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default DayEditor
