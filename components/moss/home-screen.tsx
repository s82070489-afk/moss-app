"use client"

import { useMoss } from "./moss-context"
import type { Screen } from "@/app/page"
import { Plus, X, Trash2 } from "lucide-react"
import { useState, useCallback } from "react"
import {
  getTreeStage,
  getGrowthStageLabel,
  TREE_STAGE_DISPLAY,
  getNextMilestone,
} from "@/lib/tree-utils"

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void
}

// ✅ 빈도별 메시지 풀
const messagesByFrequency = {
  frequent: [
    "Your forest remembers.",
    "Small traces become lasting memories.",
    "The forest is quietly growing.",
    "Each action leaves a gentle mark.",
    "You are slowly becoming.",
    "The trees remember your return.",
    "Quiet consistency grows deep roots.",
    "Every small step matters.",
    "Your forest grows with you.",
    "Another trace, another ring in the tree.",
  ],
  occasional: [
    "Your forest remembers.",
    "Small traces become lasting memories.",
    "The forest is quietly growing.",
    "Quiet consistency grows deep roots.",
  ],
  rare: [
    "Your forest remembers.",
    "The forest is quietly growing.",
  ],
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { habits, incrementHabit, totalActions, settings } = useMoss()
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)

  const today = new Date()
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  // ✅ settings.emotionalMessages 빈도에 따라 메시지 풀 선택
  const messages = messagesByFrequency[settings.emotionalMessages] ?? messagesByFrequency.frequent
  const randomMessage = messages[Math.floor(Date.now() / 86400000) % messages.length]

  const selectedHabit = habits.find(h => h.id === selectedHabitId) ?? null

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 bg-forest-night pointer-events-none" />

      {/* Fireflies */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-firefly"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 60}%`,
              backgroundColor: i % 3 === 0 ? '#f2d7a1' : '#5acb8a',
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${5 + (i % 3)}s`,
              boxShadow: i % 3 === 0
                ? '0 0 6px rgba(242, 215, 161, 0.6)'
                : '0 0 6px rgba(90, 203, 138, 0.6)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 pt-14 pb-32">
        <header className="mb-12 animate-fade-in-up">
          <p className="text-[rgba(255,255,255,0.38)] text-sm font-light tracking-wide mb-3">
            {dateString}
          </p>
          {/* ✅ rare 선택 시 메시지 숨김 */}
          {settings.emotionalMessages !== "rare" || Math.floor(Date.now() / 86400000) % 3 === 0 ? (
            <p className="text-[rgba(255,255,255,0.8)] text-xl font-extralight leading-relaxed">
              {randomMessage}
            </p>
          ) : null}
        </header>

        {/* Forest visualization */}
        <div
          className="relative h-[21.5rem] mb-8 flex flex-col items-center justify-end animate-fade-in-up delay-200 cursor-pointer pt-12 overflow-visible"
          onClick={() => onNavigate("forest")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onNavigate("forest")}
          aria-label="View your forest"
        >
          <div className="absolute inset-0 bg-gradient-radial from-[#5acb8a]/8 via-transparent to-transparent rounded-3xl" />
          <div className="relative flex items-end justify-center gap-4 mb-8 pt-3 overflow-visible">
            <TreeSilhouette size="sm" opacity={0.15} delay={0.3} />
            <TreeSilhouette size="md" opacity={0.25} delay={0.5} />
            <div className="relative animate-breathe" style={{ transformOrigin: "bottom center" }}>
              <TreeSilhouette size="lg" opacity={0.9} delay={0} glow />
              <div className="absolute -top-2 -left-4 w-1.5 h-1.5 rounded-full bg-[#5acb8a] animate-firefly"
                style={{ boxShadow: '0 0 8px rgba(90, 203, 138, 0.8)' }} />
              <div className="absolute top-8 -right-6 w-1 h-1 rounded-full bg-[#f2d7a1] animate-firefly delay-700"
                style={{ boxShadow: '0 0 6px rgba(242, 215, 161, 0.8)' }} />
              <div className="absolute top-0 right-2 w-1 h-1 rounded-full bg-[#9ecfff] animate-firefly delay-1500"
                style={{ boxShadow: '0 0 6px rgba(158, 207, 255, 0.6)' }} />
            </div>
            <TreeSilhouette size="md" opacity={0.2} delay={0.4} />
            <TreeSilhouette size="sm" opacity={0.12} delay={0.6} />
          </div>
          <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.15em] mb-2">
            {totalActions} traces in your forest
          </p>
        </div>

        {/* Habit list */}
        <div className="space-y-3">
          <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-4 px-1 animate-fade-in-up delay-300">
            Your growing habits
          </p>
          {habits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[rgba(255,255,255,0.25)] text-sm font-light leading-relaxed">
                Your forest is empty.<br />
                <span className="text-[rgba(255,255,255,0.38)]">Tap + to plant your first seed.</span>
              </p>
            </div>
          )}
          {habits.map((habit, index) => (
            <div
              key={habit.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <HabitCard
                habit={habit}
                onIncrement={() => incrementHabit(habit.id)}
                onOpen={() => setSelectedHabitId(habit.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedHabit && (
        <HabitDetailPanel
          habit={selectedHabit}
          onClose={() => setSelectedHabitId(null)}
          onIncrement={() => incrementHabit(selectedHabit.id)}
        />
      )}
    </div>
  )
}

// ─── Habit Detail Panel ───────────────────────────────────────────

function HabitDetailPanel({
  habit, onClose, onIncrement,
}: {
  habit: { id: string; name: string; icon: string; count: number; intention?: string; createdAt: string }
  onClose: () => void
  onIncrement: () => void
}) {
  const { deleteHabit } = useMoss()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)

  const stage = getTreeStage(habit.count)
  const toNext = (() => {
    const next = getNextMilestone(habit.count)
    return next ? next - habit.count : null
  })()

  const handleIncrement = () => {
    setIsPulsing(true)
    onIncrement()
    setTimeout(() => setIsPulsing(false), 600)
  }

  const handleDelete = () => {
    deleteHabit(habit.id)
    onClose()
  }

  const createdDate = new Date(habit.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  })

  return (
    <>
      <div className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed left-0 right-0 z-[60] animate-fade-in-up"
        style={{ animationDuration: "0.3s", bottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="moss-card rounded-t-3xl rounded-b-none border-b-0 p-6 mx-0"
          style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}>

          <div className="w-10 h-1 rounded-full bg-[rgba(255,255,255,0.15)] mx-auto mb-6" />

          <button onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center"
            aria-label="Close">
            <X className="w-4 h-4 text-[rgba(255,255,255,0.5)]" />
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(90,203,138,0.08)] border border-[rgba(90,203,138,0.15)] flex items-center justify-center text-2xl">
              {habit.icon}
            </div>
            <div>
              <h2 className="text-[rgba(255,255,255,0.92)] text-xl font-light">{habit.name}</h2>
              <p className="text-[#5acb8a] text-sm font-light mt-0.5">{TREE_STAGE_DISPLAY[stage]}</p>
            </div>
          </div>

          {habit.intention && (
            <div className="mb-5 p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
              <p className="text-[rgba(255,255,255,0.38)] text-xs tracking-widest uppercase mb-2">Intention</p>
              <p className="text-[rgba(255,255,255,0.7)] text-sm font-light leading-relaxed italic">
                &ldquo;{habit.intention}&rdquo;
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
              <p className="text-[rgba(255,255,255,0.38)] text-xs tracking-widest uppercase mb-1">Total</p>
              <p className="text-[rgba(255,255,255,0.92)] text-2xl font-extralight">{habit.count}</p>
              <p className="text-[rgba(255,255,255,0.38)] text-xs mt-0.5">traces</p>
            </div>
            <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
              <p className="text-[rgba(255,255,255,0.38)] text-xs tracking-widest uppercase mb-1">Since</p>
              <p className="text-[rgba(255,255,255,0.7)] text-sm font-light leading-tight mt-1">{createdDate}</p>
            </div>
          </div>

          {toNext !== null && (
            <div className="mb-5 p-4 rounded-2xl bg-[rgba(90,203,138,0.05)] border border-[rgba(90,203,138,0.1)]">
              <p className="text-[rgba(255,255,255,0.38)] text-xs tracking-widest uppercase mb-1">Next growth</p>
              <p className="text-[rgba(255,255,255,0.7)] text-sm font-light">
                <span className="text-[#5acb8a] font-normal">{toNext} more</span> traces until your tree grows
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleIncrement}
              className={`flex-1 py-4 rounded-2xl moss-button-primary text-sm font-light tracking-wide transition-all duration-300 ${isPulsing ? 'scale-95' : ''}`}
            >
              {isPulsing ? "✓ Recorded" : "+ Add trace"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-14 h-14 rounded-2xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] flex items-center justify-center transition-all duration-300 hover:bg-[rgba(239,68,68,0.15)]"
              aria-label="Delete habit"
            >
              <Trash2 className="w-4 h-4 text-[rgba(239,68,68,0.6)]" />
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
          <div className="moss-card p-6 rounded-3xl w-full max-w-sm">
            <p className="text-[rgba(255,255,255,0.92)] text-base font-light text-center mb-2">
              Remove this habit?
            </p>
            <p className="text-[rgba(255,255,255,0.38)] text-sm font-light text-center mb-6 leading-relaxed">
              &ldquo;{habit.name}&rdquo; and all its traces will be removed from your forest.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)] text-sm font-light"
              >
                Keep it
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-2xl bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.2)] text-[rgba(239,68,68,0.8)] text-sm font-light"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Habit Card ────────────────────────────────────────────────

function HabitCard({
  habit, onIncrement, onOpen,
}: {
  habit: { id: string; name: string; icon: string; count: number }
  onIncrement: () => void
  onOpen: () => void
}) {
  const [isPulsing, setIsPulsing] = useState(false)
  const growthStage = getGrowthStageLabel(habit.count)

  const handleIncrement = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPulsing(true)
    onIncrement()
    setTimeout(() => setIsPulsing(false), 600)
  }, [onIncrement])

  return (
    <div
      className={`group relative moss-card p-4 transition-all duration-500 cursor-pointer ${isPulsing ? 'ring-1 ring-[#5acb8a]/30' : ''}`}
      onClick={onOpen}
    >
      {isPulsing && (
        <div className="absolute inset-0 rounded-[1.25rem] bg-[#5acb8a]/10 animate-[ripple_0.6s_ease-out]" />
      )}
      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-xl border border-[rgba(255,255,255,0.04)]">
          {habit.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[rgba(255,255,255,0.92)] font-light text-base mb-0.5">{habit.name}</h3>
          <p className="text-[rgba(255,255,255,0.38)] text-xs font-light">
            {growthStage} · {habit.count} times
          </p>
        </div>
        <button
          onClick={handleIncrement}
          className="w-11 h-11 rounded-full bg-[rgba(90,203,138,0.1)] border border-[rgba(90,203,138,0.25)] flex items-center justify-center transition-all duration-400 hover:bg-[rgba(90,203,138,0.2)] hover:border-[rgba(90,203,138,0.4)] hover:scale-105 active:scale-95"
          aria-label={`Add one ${habit.name}`}
          style={{
            boxShadow: isPulsing ? '0 0 20px rgba(90,203,138,0.4)' : '0 0 10px rgba(90,203,138,0.1)'
          }}
        >
          <Plus className="w-4 h-4 text-[#5acb8a]" />
        </button>
      </div>
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#5acb8a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  )
}

// ─── Tree Silhouette ──────────────────────────────────────────────

function TreeSilhouette({
  size, opacity, delay, glow = false
}: {
  size: "sm" | "md" | "lg"
  opacity: number
  delay: number
  glow?: boolean
}) {
  const heights = { sm: "h-10", md: "h-16", lg: "h-24" }
  const widths = { sm: "w-6", md: "w-10", lg: "w-14" }

  return (
    <div
      className={`relative ${heights[size]} ${widths[size]} animate-sway`}
      style={{ opacity, animationDelay: `${delay}s` }}
    >
      {glow && (
        <div className="absolute inset-0 bg-[#5acb8a]/15 blur-2xl rounded-full animate-glow-pulse" />
      )}
      <svg viewBox="0 0 100 160" className="w-full h-full overflow-visible">
        <rect x="42" y="110" width="16" height="50" rx="2" fill="rgba(90,203,138,0.3)" />
        <ellipse cx="50" cy="92" rx="38" ry="24" fill="rgba(90,203,138,0.4)" />
        <ellipse cx="50" cy="68" rx="30" ry="22" fill="rgba(90,203,138,0.5)" />
        <ellipse cx="50" cy="46" rx="22" ry="18" fill="rgba(90,203,138,0.6)" />
        <ellipse cx="50" cy="28" rx="14" ry="12" fill="rgba(90,203,138,0.7)" />
      </svg>
    </div>
  )
}
