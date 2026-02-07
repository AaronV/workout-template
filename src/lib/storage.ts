import type { AppData, Exercise, ExerciseDay, StoredDataV1, StoredDataV2 } from '../types'
import { STORAGE_KEY, STORAGE_VERSION } from '../types'

function isExercise(value: unknown): value is Exercise {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Exercise
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.reps === 'string' &&
    typeof candidate.rest === 'string' &&
    typeof candidate.notes === 'string'
  )
}

function isExerciseDay(value: unknown): value is ExerciseDay {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as ExerciseDay
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    Array.isArray(candidate.exerciseIds) &&
    candidate.exerciseIds.every((id) => typeof id === 'string')
  )
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { exercises: [], days: [] }
    }

    const parsed = JSON.parse(raw) as StoredDataV1 | StoredDataV2

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('version' in parsed) ||
      typeof parsed.version !== 'number'
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return { exercises: [], days: [] }
    }

    if (parsed.version === STORAGE_VERSION) {
      if (
        Array.isArray(parsed.exercises) &&
        parsed.exercises.every(isExercise) &&
        Array.isArray(parsed.days) &&
        parsed.days.every(isExerciseDay)
      ) {
        return {
          exercises: parsed.exercises,
          days: parsed.days,
        }
      }

      localStorage.removeItem(STORAGE_KEY)
      return { exercises: [], days: [] }
    }

    if (parsed.version === 1) {
      if (Array.isArray(parsed.exercises) && parsed.exercises.every(isExercise)) {
        return {
          exercises: parsed.exercises,
          days: [],
        }
      }

      localStorage.removeItem(STORAGE_KEY)
      return { exercises: [], days: [] }
    }

    localStorage.removeItem(STORAGE_KEY)
    return { exercises: [], days: [] }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return { exercises: [], days: [] }
  }
}

export function saveData(data: AppData): void {
  const payload: StoredDataV2 = {
    version: STORAGE_VERSION,
    exercises: data.exercises,
    days: data.days,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
