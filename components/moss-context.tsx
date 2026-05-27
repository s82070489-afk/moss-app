"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

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

// ✅ 지원 언어
export type Language = "en" | "ko" | "ja" | "zh" | "es" | "fr"

interface MossContextType {
  habits: Habit[]
  addHabit: (habit: Omit<Habit, "id" | "count" | "createdAt" | "lastUpdated" | "dailyLog">) => void
  incrementHabit: (id: string) => void
  deleteHabit: (id: string) => void
  importData: (json: string) => { success: boolean; message: string }
  totalActions: number
  settings: {
    ambientSound: boolean
    darkMode: boolean
    emotionalMessages: "frequent" | "occasional" | "rare"
    language: Language
  }
  updateSettings: (settings: Partial<MossContextType["settings"]>) => void
}

const MossContext = createContext<MossContextType | undefined>(undefined)

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

// ✅ 기본 습관 없음 — 완전히 빈 상태로 시작
const defaultHabits: Habit[] = []

const defaultSettings = {
  ambientSound: false,
  darkMode: true,
  emotionalMessages: "frequent" as const,
  language: "en" as Language,
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
    const savedSettings = loadFromStorage("moss-settings", { ...defaultSettings })
    // 구버전 데이터에 language 없을 수 있으니 보완
    setHabits(migratedHabits)
    setSettings({ ...defaultSettings, ...savedSettings })
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

  // ✅ JSON 파일 불러오기 — Export로 받은 파일을 다시 로드
  const importData = (json: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(json)

      // 유효성 검사
      if (!data.habits || !Array.isArray(data.habits)) {
        return { success: false, message: "Invalid file format." }
      }

      const importedHabits: Habit[] = data.habits.map((h: Partial<Habit>) => ({
        id: h.id ?? Date.now().toString(),
        name: h.name ?? "Unnamed",
        icon: h.icon ?? "🌱",
        count: h.count ?? 0,
        intention: h.intention ?? undefined,
        createdAt: h.createdAt ?? new Date().toISOString(),
        lastUpdated: h.lastUpdated ?? new Date().toISOString(),
        dailyLog: h.dailyLog ?? {},
      }))

      setHabits(importedHabits)
      return { success: true, message: `${importedHabits.length} habits restored.` }
    } catch {
      return { success: false, message: "Could not read file." }
    }
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
        importData,
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
