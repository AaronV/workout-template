import { useState } from 'react'
import DayEditor from './components/DayEditor'
import ExerciseEditor from './components/ExerciseEditor'
import PrintableDayView from './components/PrintableDayView'
import PrintTabControls from './components/PrintTabControls'
import { loadData } from './lib/storage'
import { type ActiveTab, useWorkoutTemplate } from './hooks/useWorkoutTemplate'

const TABS: Array<{ id: ActiveTab; label: string }> = [
  { id: 'exercises', label: 'Exercises' },
  { id: 'days', label: 'Days' },
  { id: 'print', label: 'Print' },
]

function App() {
  const [initialData] = useState(() => loadData())
  const {
    activeTab,
    setActiveTab,
    days,
    printableDay,
    exerciseLookup,
    selectedPrintDayId,
    setSelectedPrintDayId,
    exerciseEditorProps,
    dayEditorProps,
  } = useWorkoutTemplate({
    initialExercises: initialData.exercises,
    initialDays: initialData.days,
  })

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900 print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="no-print rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold tracking-tight">Workout Template Creator</h1>
          <p className="mt-3 text-base text-slate-600">
            Build and print your workout sheet, then fill in sets and reps at the gym.
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
            {activeTab === 'days' ? <DayEditor {...dayEditorProps} /> : null}
            {activeTab === 'print' ? (
              <PrintTabControls
                days={days}
                selectedPrintDayId={selectedPrintDayId}
                hasPrintableDay={Boolean(printableDay)}
                onSelectedPrintDayIdChange={setSelectedPrintDayId}
                onPrint={() => window.print()}
              />
            ) : null}
          </div>
        </section>

        {activeTab === 'print' ? <PrintableDayView printableDay={printableDay} exerciseLookup={exerciseLookup} /> : null}
      </div>
    </main>
  )
}

export default App
