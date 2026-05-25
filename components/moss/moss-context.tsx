"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// 날짜별 기록 — "2026-05-24" 형식의 키에 횟수 저장
export type DailyLog = Record<string, number>

export interface Habit {
  id: string
  name: string
  icon: string
  count: number
  intention?: string
  createdAt: string
  lastUpdated: string
  dailyLog: DailyLog
}

interface MossContextType {
  habits: Habit[]
  addHabit: (habit: Omit<Habit, "id" | "count" | "createdAt" | "lastUpdated" | "dailyLog">) => void
  incrementHabit: (id: string) => void
  deleteHabit: (id: string) => void
  totalActions: number
  settings: {
    ambientSound: boolean
    darkMode: boolean
    emotionalMessages: "frequent" | "occasional" | "rare"
  }
  updateSettings: (settings: Partial<MossContextType["settings"]>) => void
}

const MossContext = createContext<MossContextType | undefined>(undefined)

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const defaultHabits: Habit[] = [
  { id: "1", name: "Reading", icon: "📖", count: 127, intention: "I want to learn something new every day", createdAt: "2024-01-15", lastUpdated: new Date().toISOString(), dailyLog: {} },
  { id: "2", name: "Meditation", icon: "🧘", count: 89, intention: "I want to become calmer", createdAt: "2024-02-01", lastUpdated: new Date().toISOString(), dailyLog: {} },
  { id: "3", name: "Drawing", icon: "🎨", count: 45, intention: "I want to express myself", createdAt: "2024-03-10", lastUpdated: new Date().toISOString(), dailyLog: {} },
  { id: "4", name: "Walking", icon: "🚶", count: 203, intention: "I want to connect with nature", createdAt: "2024-01-01", lastUpdated: new Date().toISOString(), dailyLog: {} },
  { id: "5", name: "Writing", icon: "✍️", count: 12, intention: "I want to leave small traces every day", createdAt: "2024-05-01", lastUpdated: new Date().toISOString(), dailyLog: {} },
]

const defaultSettings = {
  ambientSound: true,
  darkMode: true,
  emotionalMessages: "frequent" as const,
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const saved = localStorage.getItem(key)
    if (!saved) return fallback
    return JSON.parse(saved) as T
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function MossProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits)
  const [settings, setSettings] = useState(defaultSettings)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const savedHabits = loadFromStorage<Habit[]>("moss-habits", defaultHabits)
    const migratedHabits = savedHabits.map(h => ({
      ...h,
      dailyLog: h.dailyLog ?? {}
    }))
    const savedSettings = loadFromStorage("moss-settings", defaultSettings)
    setHabits(migratedHabits)
    setSettings(savedSettings)
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    saveToStorage("moss-habits", habits)
  }, [habits, loaded])

  useEffect(() => {
    if (!loaded) return
    saveToStorage("moss-settings", settings)
  }, [settings, loaded])

  const addHabit = (habit: Omit<Habit, "id" | "count" | "createdAt" | "lastUpdated" | "dailyLog">) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      count: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      dailyLog: {},
    }
    setHabits((prev) => [...prev, newHabit])
  }

  const incrementHabit = (id: string) => {
    const today = todayKey()
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              count: habit.count + 1,
              lastUpdated: new Date().toISOString(),
              dailyLog: {
                ...habit.dailyLog,
                [today]: (habit.dailyLog[today] ?? 0) + 1,
              },
            }
          : habit
      )
    )
  }

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id))
  }

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const totalActions = habits.reduce((sum, habit) => sum + habit.count, 0)

  return (
    <MossContext.Provider
      value={{
        habits,
        addHabit,
        incrementHabit,
        deleteHabit,
        totalActions,
        settings,
        updateSettings,
      }}
    >
      {children}
    </MossContext.Provider>
  )
}

export function useMoss() {
  const context = useContext(MossContext)
  if (context === undefined) {
    throw new Error("useMoss must be used within a MossProvider")
  }
  return context
}
