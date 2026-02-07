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
            <h1 className="print-title text-3xl font-bold tracking-tight">{printableDay.title}</h1>

            <div className="mt-6 space-y-6">
              {printableDay.exerciseIds.map((exerciseId, index) => {
                const exercise = exerciseLookup.get(exerciseId)
                const exerciseName = exercise?.name ?? `[Removed exercise ${index + 1}]`
                const exerciseReps = (exercise?.reps ?? '').toUpperCase() || '-'
                const exerciseRest = (exercise?.rest ?? '').toUpperCase() || '-'

                return (
                  <article key={`${printableDay.id}-${exerciseId}-${index}`} className="print-exercise">
                    <h2 className="text-lg font-semibold tracking-tight">{exerciseName}</h2>
                    <table className="mt-2 w-full border-collapse text-sm">
                      <thead>
                        <tr>
                          <th className="border border-slate-900 px-3 py-2 text-left font-semibold">REPS</th>
                          <th className="border border-slate-900 px-3 py-2 text-left font-semibold">REST</th>
                          <th className="border border-slate-900 px-3 py-2 text-left font-semibold">WEEK 1</th>
                          <th className="border border-slate-900 px-3 py-2 text-left font-semibold">WEEK 2</th>
                          <th className="border border-slate-900 px-3 py-2 text-left font-semibold">WEEK 3</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-900 px-3 py-3 font-medium">{exerciseReps}</td>
                          <td className="border border-slate-900 px-3 py-3 font-medium">{exerciseRest}</td>
                          <td className="h-12 border border-slate-900 px-3 py-3" />
                          <td className="h-12 border border-slate-900 px-3 py-3" />
                          <td className="h-12 border border-slate-900 px-3 py-3" />
                        </tr>
                      </tbody>
                    </table>
                  </article>
                )
              })}
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
