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

function parseStoredData(parsed: unknown): AppData | null {
  if (typeof parsed !== 'object' || parsed === null) {
    return null
  }

  const candidate = parsed as { version?: unknown; exercises?: unknown; days?: unknown }

  if (!('version' in candidate)) {
    if (
      Array.isArray(candidate.exercises) &&
      candidate.exercises.every(isExercise) &&
      Array.isArray(candidate.days) &&
      candidate.days.every(isExerciseDay)
    ) {
      return {
        exercises: candidate.exercises,
        days: candidate.days,
      }
    }

    return null
  }

  if (typeof candidate.version !== 'number') {
    return null
  }

  if (candidate.version === STORAGE_VERSION) {
    if (
      Array.isArray(candidate.exercises) &&
      candidate.exercises.every(isExercise) &&
      Array.isArray(candidate.days) &&
      candidate.days.every(isExerciseDay)
    ) {
      return {
        exercises: candidate.exercises,
        days: candidate.days,
      }
    }

    return null
  }

  if (candidate.version === 1) {
    if (Array.isArray(candidate.exercises) && candidate.exercises.every(isExercise)) {
      return {
        exercises: candidate.exercises,
        days: [],
      }
    }

    return null
  }

  return null
}

function toStoredPayload(data: AppData): StoredDataV2 {
  return {
    version: STORAGE_VERSION,
    exercises: data.exercises,
    days: data.days,
  }
}

export function parseImportedData(raw: string): AppData | null {
  try {
    const parsed = JSON.parse(raw) as StoredDataV1 | StoredDataV2 | AppData
    return parseStoredData(parsed)
  } catch {
    return null
  }
}

export function serializeData(data: AppData): string {
  return JSON.stringify(toStoredPayload(data), null, 2)
}

export function clearStoredData(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function loadData(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { exercises: [], days: [] }
  }

  const data = parseImportedData(raw)
  if (data) {
    return data
  }

  clearStoredData()
  return { exercises: [], days: [] }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStoredPayload(data)))
}
