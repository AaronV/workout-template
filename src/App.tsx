import { useEffect, useState } from 'react'
import AppFooterControls from './components/AppFooterControls'
import DayEditor from './components/DayEditor'
import ExerciseEditor from './components/ExerciseEditor'
import ExerciseModal from './components/ExerciseModal'
import PrintableDayView from './components/PrintableDayView'
import { loadData } from './lib/storage'
import { type ActiveTab, useWorkoutTemplate } from './hooks/useWorkoutTemplate'

const TABS: Array<{ id: ActiveTab; label: string }> = [
  { id: 'days', label: 'Days' },
  { id: 'exercises', label: 'Exercises' },
]

function App() {
  const [initialData] = useState(() => loadData())
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false)
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false)
  const {
    activeTab,
    setActiveTab,
    printableDay,
    exerciseLookup,
    setSelectedPrintDayId,
    exportAllData,
    importAllData,
    clearAllData,
    exerciseEditorProps,
    exerciseModalProps,
    dayEditorProps,
  } = useWorkoutTemplate({
    initialExercises: initialData.exercises,
    initialDays: initialData.days,
  })

  useEffect(() => {
    if (!printableDay) {
      setIsPrintViewOpen(false)
      setShouldAutoPrint(false)
    }
  }, [printableDay])

  useEffect(() => {
    if (!isPrintViewOpen || !printableDay || !shouldAutoPrint) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      window.print()
      setShouldAutoPrint(false)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [isPrintViewOpen, printableDay, shouldAutoPrint])

  const handleOpenPrintView = (dayId: string) => {
    setSelectedPrintDayId(dayId)
    setActiveTab('days')
    setIsPrintViewOpen(true)
    setShouldAutoPrint(true)
  }

  const handleClosePrintView = () => {
    setIsPrintViewOpen(false)
    setShouldAutoPrint(false)
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900 print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl space-y-8">
        {isPrintViewOpen ? (
          <>
            <section className="no-print rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {printableDay ? `Print ${printableDay.title}` : 'Printable View'}
                  </h1>
                  <p className="mt-3 text-base text-slate-600">
                    Preview the workout sheet, then print when it looks right.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    onClick={handleClosePrintView}
                  >
                    Back to Days
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => window.print()}
                    disabled={!printableDay}
                  >
                    Print Day
                  </button>
                </div>
              </div>
            </section>

            <PrintableDayView printableDay={printableDay} exerciseLookup={exerciseLookup} />
          </>
        ) : (
          <section className="no-print rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-bold tracking-tight">Workout Template Creator</h1>
            <p className="mt-3 text-base text-slate-600">
              Start by building a workout day, add exercises as you go, and print a sheet to fill in at the gym.
            </p>

            <div className="mt-6 flex gap-2 border-b border-slate-200">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`rounded-t-md px-4 py-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === 'exercises' ? <ExerciseEditor {...exerciseEditorProps} /> : null}
              {activeTab === 'days' ? <DayEditor {...dayEditorProps} onPrintDay={handleOpenPrintView} /> : null}
            </div>
          </section>
        )}

        <AppFooterControls
          repoUrl="https://github.com/AaronV/workout-template"
          onExportData={exportAllData}
          onImportData={importAllData}
          onClearAllData={clearAllData}
        />
      </div>

      <ExerciseModal {...exerciseModalProps} />
    </main>
  )
}

export default App
