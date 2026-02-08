import type { Exercise, ExerciseDay } from '../types'

type PrintableDayViewProps = {
  days: ExerciseDay[]
  selectedPrintDayId: string
  printableDay: ExerciseDay | null
  exerciseLookup: Map<string, Exercise>
  onSelectedPrintDayIdChange: (dayId: string) => void
  onPrint: () => void
}

function PrintableDayView({
  days,
  selectedPrintDayId,
  printableDay,
  exerciseLookup,
  onSelectedPrintDayIdChange,
  onPrint,
}: PrintableDayViewProps) {
  const weekCopies = [
    { label: 'A', startWeek: 1 },
    { label: 'B', startWeek: 4 },
  ]

  return (
    <>
      <section className="no-print rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold">Printable View</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
            value={selectedPrintDayId}
            onChange={(event) => onSelectedPrintDayIdChange(event.target.value)}
            disabled={days.length === 0}
          >
            {days.length === 0 ? (
              <option value="">No days available</option>
            ) : (
              days.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.title}
                </option>
              ))
            )}
          </select>
          <button
            type="button"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onPrint}
            disabled={!printableDay}
          >
            Print Day
          </button>
        </div>
      </section>

      <section className="print-sheet rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 print:shadow-none print:ring-0">
        {printableDay ? (
          <>
            <div className="print-copies grid gap-6 lg:grid-cols-2">
              {weekCopies.map((copy) => (
                <article key={copy.label} className="print-copy space-y-2">
                  <h1 className="print-title text-2xl font-bold tracking-tight">{printableDay.title}</h1>
                  <div className="print-exercise-list space-y-2">
                    {printableDay.exerciseIds.map((exerciseId, index) => {
                      const exercise = exerciseLookup.get(exerciseId)
                      const exerciseName = exercise?.name ?? `[Removed exercise ${index + 1}]`
                      const exerciseNotes = exercise?.notes ?? ''
                      const exerciseReps = (exercise?.reps ?? '').toUpperCase() || '-'
                      const exerciseRest = (exercise?.rest ?? '').toUpperCase() || '-'

                      return (
                        <section key={`${printableDay.id}-${copy.label}-${exerciseId}-${index}`} className="print-exercise">
                          <div className="flex items-baseline justify-between gap-2">
                            <h2 className="text-sm font-semibold tracking-tight">{exerciseName}</h2>
                            {exerciseNotes ? (
                              <p className="max-w-[50%] truncate text-right text-[10px] font-normal text-slate-700">
                                {exerciseNotes}
                              </p>
                            ) : null}
                          </div>
                          <table className="mt-1 w-full border-collapse text-[10px]">
                            <thead>
                              <tr>
                                <th className="border border-slate-900 px-2 py-0.5 text-left font-semibold">REPS</th>
                                <th className="border border-slate-900 px-2 py-0.5 text-left font-semibold">REST</th>
                                <th className="border border-slate-900 px-2 py-0.5 text-left font-semibold">
                                  WEEK {copy.startWeek}
                                </th>
                                <th className="border border-slate-900 px-2 py-0.5 text-left font-semibold">
                                  WEEK {copy.startWeek + 1}
                                </th>
                                <th className="border border-slate-900 px-2 py-0.5 text-left font-semibold">
                                  WEEK {copy.startWeek + 2}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({ length: 3 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                  <td className="border border-slate-900 px-2 py-1 font-medium">{exerciseReps}</td>
                                  <td className="border border-slate-900 px-2 py-1 font-medium">{exerciseRest}</td>
                                  <td className="h-6 border border-slate-900 px-2 py-1" />
                                  <td className="h-6 border border-slate-900 px-2 py-1" />
                                  <td className="h-6 border border-slate-900 px-2 py-1" />
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </section>
                      )
                    })}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">Create and select a day to view a printable template.</p>
        )}
      </section>
    </>
  )
}

export default PrintableDayView
