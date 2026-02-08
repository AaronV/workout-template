import type { ExerciseDay } from '../types'

type PrintTabControlsProps = {
  days: ExerciseDay[]
  selectedPrintDayId: string
  hasPrintableDay: boolean
  onSelectedPrintDayIdChange: (dayId: string) => void
  onPrint: () => void
}

function PrintTabControls({
  days,
  selectedPrintDayId,
  hasPrintableDay,
  onSelectedPrintDayIdChange,
  onPrint,
}: PrintTabControlsProps) {
  return (
    <section>
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
          disabled={!hasPrintableDay}
        >
          Print Day
        </button>
      </div>
    </section>
  )
}

export default PrintTabControls
