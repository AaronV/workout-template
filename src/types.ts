export type Exercise = {
  id: string
  name: string
  reps: string
  rest: string
  notes: string
}

export type ExerciseDay = {
  id: string
  title: string
  exerciseIds: string[]
}

export type StoredDataV1 = {
  version: 1
  exercises: Exercise[]
}

export type StoredDataV2 = {
  version: 2
  exercises: Exercise[]
  days: ExerciseDay[]
}

export type AppData = {
  exercises: Exercise[]
  days: ExerciseDay[]
}

export const STORAGE_KEY = 'workout-template-data'
export const STORAGE_VERSION = 2
export const DEFAULT_REPS = '8-10'
export const DEFAULT_REST = '90s'
export const MAX_DAY_EXERCISES = 5
