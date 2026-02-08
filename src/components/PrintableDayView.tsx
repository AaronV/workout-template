import type { Exercise, ExerciseDay } from '../types'

type PrintableDayViewProps = {
  printableDay: ExerciseDay | null
  exerciseLookup: Map<string, Exercise>
}

function PrintableDayView({ printableDay, exerciseLookup }: PrintableDayViewProps) {
  const weekCopies = [
    { label: 'A', startWeek: 1 },
    { label: 'B', startWeek: 4 },
  ]

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 print:shadow-none print:ring-0">
      <div className="print-sheet">
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
      </div>
    </section>
  )
}

export default PrintableDayView
