import { useEffect, useState } from 'react'
import { clearStoredData, parseImportedData, saveData, serializeData } from '../lib/storage'
import { MAX_DAY_EXERCISES, type Exercise, type ExerciseDay } from '../types'
import { useDays } from './useDays'
import { useExercises } from './useExercises'
import { usePrintSelection } from './usePrintSelection'

export type ActiveTab = 'exercises' | 'days' | 'print'

type UseWorkoutTemplateOptions = {
  initialExercises: Exercise[]
  initialDays: ExerciseDay[]
}

export function useWorkoutTemplate({ initialExercises, initialDays }: UseWorkoutTemplateOptions) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('exercises')

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
      isModalOpen: exercisesState.isExerciseModalOpen,
      exerciseName: exercisesState.exerciseName,
      exerciseReps: exercisesState.exerciseReps,
      exerciseRest: exercisesState.exerciseRest,
      exerciseNotes: exercisesState.exerciseNotes,
      editingExerciseId: exercisesState.editingExerciseId,
      exercises: exercisesState.exercises,
      onOpenCreateExercise: exercisesState.handleOpenCreateExercise,
      onCloseExerciseModal: exercisesState.resetExerciseForm,
      onExerciseNameChange: exercisesState.setExerciseName,
      onExerciseRepsChange: exercisesState.setExerciseReps,
      onExerciseRestChange: exercisesState.setExerciseRest,
      onExerciseNotesChange: exercisesState.setExerciseNotes,
      onSaveExercise: exercisesState.handleSaveExercise,
      onCancelEditExercise: exercisesState.resetExerciseForm,
      onEditExercise: exercisesState.handleEditExercise,
      onDeleteExercise: handleDeleteExercise,
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
      onOpenCreateDay: daysState.handleOpenCreateDay,
      onCloseDayModal: () => daysState.resetDayForm(daysState.days.length),
      onDayTitleChange: daysState.setDayTitle,
      onSelectedDayExerciseIdChange: daysState.setSelectedDayExerciseId,
      onAddExerciseToDay: daysState.handleAddExerciseToDay,
      onRemoveExerciseFromDay: daysState.handleRemoveExerciseFromDay,
      onSaveDay: daysState.handleSaveDay,
      onCancelEditDay: () => daysState.resetDayForm(daysState.days.length),
      onEditDay: daysState.handleEditDay,
      onDeleteDay: daysState.handleDeleteDay,
    },
  }
}
