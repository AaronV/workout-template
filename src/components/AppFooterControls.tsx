import { useRef, useState } from 'react'

type AppFooterControlsProps = {
  repoUrl: string
  onExportData: () => string
  onImportData: (raw: string) => boolean
  onClearAllData: () => void
}

function AppFooterControls({
  repoUrl,
  onExportData,
  onImportData,
  onClearAllData,
}: AppFooterControlsProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const payload = onExportData()
    const blob = new Blob([payload], { type: 'application/json' })
    const downloadUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = downloadUrl
    anchor.download = `workout-template-data-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(downloadUrl)
    setMessage('Exported current data as JSON.')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    try {
      const raw = await selectedFile.text()
      const success = onImportData(raw)
      setMessage(success ? 'Imported data successfully.' : 'Import failed: unsupported or invalid data file.')
    } catch {
      setMessage('Import failed: unable to read the selected file.')
    } finally {
      event.target.value = ''
    }
  }

  const handleConfirmClear = () => {
    onClearAllData()
    setIsClearModalOpen(false)
    setMessage('All local data has been cleared.')
  }

  return (
    <footer className="no-print border-t border-slate-200 pt-4 text-sm text-slate-600">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          onClick={handleExport}
        >
          Export JSON
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          onClick={handleImportClick}
        >
          Import JSON
        </button>
        <button
          type="button"
          className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
          onClick={() => setIsClearModalOpen(true)}
        >
          Clear All Data
        </button>
        <span className="mx-1 hidden h-4 w-px bg-slate-300 sm:inline-block" />
        <span>
          Source:{' '}
          <a
            className="font-medium text-slate-900 underline hover:text-slate-700"
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileSelected}
      />

      {message ? <p className="mt-2 text-xs text-slate-600">{message}</p> : null}

      {isClearModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold">Clear all data?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will remove all exercises and days from local storage on this browser.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setIsClearModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                onClick={handleConfirmClear}
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </footer>
  )
}

export default AppFooterControls
