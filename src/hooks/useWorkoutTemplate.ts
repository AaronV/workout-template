import { useEffect, useState } from 'react'
import { clearStoredData, parseImportedData, saveData, serializeData } from '../lib/storage'
import { DEFAULT_REPS, DEFAULT_REST, MAX_DAY_EXERCISES, type Exercise, type ExerciseDay } from '../types'
import { useDays } from './useDays'
import { useExercises } from './useExercises'
import { usePrintSelection } from './usePrintSelection'

export type ActiveTab = 'exercises' | 'days'

type UseWorkoutTemplateOptions = {
  initialExercises: Exercise[]
  initialDays: ExerciseDay[]
}

export function useWorkoutTemplate({ initialExercises, initialDays }: UseWorkoutTemplateOptions) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('days')
  const [isQuickAddExerciseOpen, setIsQuickAddExerciseOpen] = useState(false)
  const [quickAddExerciseName, setQuickAddExerciseName] = useState('')
  const [quickAddExerciseReps, setQuickAddExerciseReps] = useState(DEFAULT_REPS)
  const [quickAddExerciseRest, setQuickAddExerciseRest] = useState(DEFAULT_REST)
  const [quickAddExerciseNotes, setQuickAddExerciseNotes] = useState('')
  const [quickAddExerciseFeedback, setQuickAddExerciseFeedback] = useState('')

  const exercisesState = useExercises({ initialExercises })
  const daysState = useDays({ initialDays, exercises: exercisesState.exercises })
  const printState = usePrintSelection({ days: daysState.days })

  useEffect(() => {
    saveData({ exercises: exercisesState.exercises, days: daysState.days })
  }, [exercisesState.exercises, daysState.days])

  const handleDeleteExercise = (exerciseId: string) => {
    exercisesState.handleDeleteExercise(exerciseId)
    daysState.removeExerciseReferences(exerciseId)
  }

  const resetQuickAddExerciseForm = () => {
    setQuickAddExerciseName('')
    setQuickAddExerciseReps(DEFAULT_REPS)
    setQuickAddExerciseRest(DEFAULT_REST)
    setQuickAddExerciseNotes('')
  }

  const handleOpenQuickAddExercise = () => {
    resetQuickAddExerciseForm()
    setQuickAddExerciseFeedback('')
    setIsQuickAddExerciseOpen(true)
  }

  const handleCloseQuickAddExercise = () => {
    resetQuickAddExerciseForm()
    setQuickAddExerciseFeedback('')
    setIsQuickAddExerciseOpen(false)
  }

  const handleSaveExerciseFromDay = () => {
    const savedExercise = exercisesState.handleSaveExerciseDraft({
      name: quickAddExerciseName,
      reps: quickAddExerciseReps,
      rest: quickAddExerciseRest,
      notes: quickAddExerciseNotes,
    })

    if (!savedExercise) {
      return
    }

    const addResult = daysState.addExerciseToDay(savedExercise.id)
    if (addResult === 'full') {
      setQuickAddExerciseFeedback('Exercise saved, but this day already has the maximum number of exercises.')
    } else if (addResult === 'duplicate') {
      setQuickAddExerciseFeedback('Exercise saved, but it was already included in this day.')
    } else {
      setQuickAddExerciseFeedback('')
    }

    resetQuickAddExerciseForm()
    setIsQuickAddExerciseOpen(false)
    daysState.setSelectedDayExerciseId('')
  }

  const handleEditExerciseFromDay = (exerciseId: string) => {
    const exercise = daysState.exerciseLookup.get(exerciseId)
    if (!exercise) return

    exercisesState.handleEditExercise(exercise)
  }

  const exportAllData = () => {
    return serializeData({
      exercises: exercisesState.exercises,
      days: daysState.days,
    })
  }

  const importAllData = (raw: string) => {
    const parsedData = parseImportedData(raw)
    if (!parsedData) {
      return false
    }

    exercisesState.replaceExercises(parsedData.exercises)
    daysState.replaceDays(parsedData.days)
    return true
  }

  const clearAllData = () => {
    clearStoredData()
    exercisesState.replaceExercises([])
    daysState.replaceDays([])
    handleCloseQuickAddExercise()
  }

  return {
    activeTab,
    setActiveTab,
    days: daysState.days,
    printableDay: printState.printableDay,
    exerciseLookup: daysState.exerciseLookup,
    selectedPrintDayId: printState.selectedPrintDayId,
    setSelectedPrintDayId: printState.setSelectedPrintDayId,
    exportAllData,
    importAllData,
    clearAllData,
    exerciseEditorProps: {
      exercises: exercisesState.exercises,
      onOpenCreateExercise: exercisesState.handleOpenCreateExercise,
      onEditExercise: exercisesState.handleEditExercise,
      onDeleteExercise: handleDeleteExercise,
    },
    exerciseModalProps: {
      isOpen: exercisesState.isExerciseModalOpen,
      exerciseName: exercisesState.exerciseName,
      exerciseReps: exercisesState.exerciseReps,
      exerciseRest: exercisesState.exerciseRest,
      exerciseNotes: exercisesState.exerciseNotes,
      editingExerciseId: exercisesState.editingExerciseId,
      onClose: exercisesState.resetExerciseForm,
      onExerciseNameChange: exercisesState.setExerciseName,
      onExerciseRepsChange: exercisesState.setExerciseReps,
      onExerciseRestChange: exercisesState.setExerciseRest,
      onExerciseNotesChange: exercisesState.setExerciseNotes,
      onSave: exercisesState.handleSaveExercise,
      onCancelEdit: exercisesState.resetExerciseForm,
    },
    dayEditorProps: {
      isModalOpen: daysState.isDayModalOpen,
      dayTitle: daysState.dayTitle,
      dayExerciseIds: daysState.dayExerciseIds,
      selectedDayExerciseId: daysState.selectedDayExerciseId,
      editingDayId: daysState.editingDayId,
      days: daysState.days,
      sortedExercises: daysState.sortedExercises,
      exerciseLookup: daysState.exerciseLookup,
      maxDayExercises: MAX_DAY_EXERCISES,
      isQuickAddExerciseOpen,
      quickAddExerciseName,
      quickAddExerciseReps,
      quickAddExerciseRest,
      quickAddExerciseNotes,
      quickAddExerciseFeedback,
      onOpenCreateDay: daysState.handleOpenCreateDay,
      onCloseDayModal: () => daysState.resetDayForm(daysState.days.length),
      onDayTitleChange: daysState.setDayTitle,
      onSelectedDayExerciseIdChange: daysState.setSelectedDayExerciseId,
      onAddExerciseToDay: daysState.handleAddExerciseToDay,
      onRemoveExerciseFromDay: daysState.handleRemoveExerciseFromDay,
      onMoveExerciseInDay: daysState.handleMoveExerciseInDay,
      onOpenQuickAddExercise: handleOpenQuickAddExercise,
      onCloseQuickAddExercise: handleCloseQuickAddExercise,
      onQuickAddExerciseNameChange: setQuickAddExerciseName,
      onQuickAddExerciseRepsChange: setQuickAddExerciseReps,
      onQuickAddExerciseRestChange: setQuickAddExerciseRest,
      onQuickAddExerciseNotesChange: setQuickAddExerciseNotes,
      onSaveExerciseFromDay: handleSaveExerciseFromDay,
      onEditExerciseFromDay: handleEditExerciseFromDay,
      onSaveDay: daysState.handleSaveDay,
      onCancelEditDay: () => daysState.resetDayForm(daysState.days.length),
      onEditDay: daysState.handleEditDay,
      onDeleteDay: daysState.handleDeleteDay,
    },
  }
}
