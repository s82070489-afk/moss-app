"use client"

import { useMoss } from "./moss-context"
import { Moon, Volume2, Bell, Download, MessageCircle, ChevronRight } from "lucide-react"


export function SettingsScreen() {
  const { settings, updateSettings, habits, totalActions } = useMoss()
  // ✅ Export — JSON 파일 다운로드
  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
      summary: {
        totalHabits: habits.length,
        totalTraces: totalActions,
      },
      habits: habits.map(h => ({
        name: h.name,
        icon: h.icon,
        intention: h.intention ?? null,
        count: h.count,
        createdAt: h.createdAt,
        lastUpdated: h.lastUpdated,
        dailyLog: h.dailyLog,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `moss-forest-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ✅ 브라우저 알림 요청
  const handleNotificationRequest = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.")
      return
    }
    if (Notification.permission === "granted") {
      new Notification("Moss 🌿", {
        body: "Your forest is waiting. Time to leave a trace.",
      })
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        new Notification("Moss 🌿", {
          body: "Notifications enabled. Your forest will remind you gently.",
        })
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-[#020816] via-[#04111d] to-[#071421]" />

      <div className="relative z-10 px-6 pt-14 pb-32">
        <header className="mb-10 animate-fade-in-up">
          <h1 className="text-2xl font-extralight text-[rgba(255,255,255,0.92)] mb-2 tracking-tight">
            Settings
          </h1>
          <p className="text-[rgba(255,255,255,0.38)] text-sm font-light">
            Customize your sanctuary
          </p>
        </header>

        <div className="space-y-8">
          {/* Atmosphere */}
          <div className="animate-fade-in-up delay-100">
            <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              Atmosphere
            </p>
            <div className="moss-card overflow-hidden">
              <ToggleSetting
                icon={Moon}
                label="Dark Mode"
                description="Always on for the forest"
                checked={settings.darkMode}
                onChange={(checked) => updateSettings({ darkMode: checked })}
                disabled
              />
              <div className="h-px bg-[rgba(255,255,255,0.04)] mx-4" />
              <ToggleSetting
                icon={Volume2}
                label="Ambient Sound"
                description="Soft forest wind atmosphere"
                checked={settings.ambientSound}
                onChange={(checked) => updateSettings({ ambientSound: checked })}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="animate-fade-in-up delay-200">
            <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              Notifications
            </p>
            <div className="moss-card overflow-hidden">
              <ActionSetting
                icon={Bell}
                label="Enable Reminders"
                description={
                  typeof window !== "undefined" && Notification.permission === "granted"
                    ? "Notifications active"
                    : "Tap to allow gentle reminders"
                }
                onClick={handleNotificationRequest}
              />
              <div className="h-px bg-[rgba(255,255,255,0.04)] mx-4" />
              <SelectSetting
                icon={MessageCircle}
                label="Emotional Messages"
                value={
                  settings.emotionalMessages === "frequent"
                    ? "Frequent"
                    : settings.emotionalMessages === "occasional"
                    ? "Occasional"
                    : "Rare"
                }
                options={["Frequent", "Occasional", "Rare"]}
                onSelect={(value) => {
                  const mapped = value.toLowerCase() as "frequent" | "occasional" | "rare"
                  updateSettings({ emotionalMessages: mapped })
                }}
              />
            </div>
          </div>

          {/* Data */}
          <div className="animate-fade-in-up delay-300">
            <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              Data
            </p>
            <div className="moss-card overflow-hidden">
              <ActionSetting
                icon={Download}
                label="Export Your Forest"
                description="Download your memories as JSON"
                onClick={handleExport}
              />
            </div>
          </div>

          {/* About */}
          <div className="animate-fade-in-up delay-500">
            <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              About
            </p>
            <div className="moss-card p-6">
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                  style={{
                    background: "rgba(90, 203, 138, 0.1)",
                    border: "1px solid rgba(90, 203, 138, 0.2)",
                    boxShadow: "0 0 30px rgba(90, 203, 138, 0.15)",
                  }}
                >
                  <svg viewBox="0 0 40 50" className="w-8 h-10">
                    <rect x="17" y="35" width="6" height="15" rx="1" fill="rgba(90, 203, 138, 0.4)" />
                    <ellipse cx="20" cy="28" rx="16" ry="12" fill="rgba(90, 203, 138, 0.5)" />
                    <ellipse cx="20" cy="18" rx="12" ry="10" fill="rgba(90, 203, 138, 0.6)" />
                    <ellipse cx="20" cy="10" rx="8" ry="7" fill="rgba(90, 203, 138, 0.7)" />
                  </svg>
                </div>
                <h3 className="text-[rgba(255,255,255,0.92)] font-extralight text-xl mb-1">Moss</h3>
                <p className="text-[rgba(255,255,255,0.38)] text-xs font-light mb-5">Version 1.0.0</p>
                <p className="text-[rgba(255,255,255,0.5)] text-sm font-light leading-relaxed max-w-xs mx-auto">
                  A calm emotional space where small repeated actions slowly grow into a living memory forest.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center animate-fade-in-up delay-700">
          <p className="text-[rgba(255,255,255,0.25)] text-xs font-light tracking-wide">
            Made with quietness
          </p>
        </div>
      </div>
    </div>
  )
}

function ToggleSetting({
  icon: Icon, label, description, checked, onChange, disabled = false,
}: {
  icon: typeof Moon
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <Icon className="w-5 h-5 text-[rgba(255,255,255,0.5)]" />
      </div>
      <div className="flex-1">
        <p className="text-[rgba(255,255,255,0.92)] text-sm font-light">{label}</p>
        <p className="text-[rgba(255,255,255,0.38)] text-xs font-light">{description}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className="relative w-12 h-7 rounded-full transition-all duration-400"
        style={{
          backgroundColor: checked ? "rgba(90,203,138,0.5)" : "rgba(255,255,255,0.08)",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <div
          className="absolute top-1 w-5 h-5 rounded-full transition-transform duration-400"
          style={{
            backgroundColor: checked ? "#5acb8a" : "rgba(255,255,255,0.6)",
            transform: checked ? "translateX(24px)" : "translateX(4px)",
            boxShadow: checked ? "0 0 8px rgba(90,203,138,0.5)" : "none",
          }}
        />
      </button>
    </div>
  )
}

function SelectSetting({
  icon: Icon, label, value, options, onSelect,
}: {
  icon: typeof Bell
  label: string
  value: string
  options?: string[]
  onSelect?: (value: string) => void
}) {
  return (
    <button
      className="w-full flex items-center gap-4 p-4 text-left transition-all duration-400 hover:bg-[rgba(255,255,255,0.02)]"
      onClick={() => {
        if (options && onSelect) {
          const currentIndex = options.indexOf(value)
          const nextIndex = (currentIndex + 1) % options.length
          onSelect(options[nextIndex])
        }
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <Icon className="w-5 h-5 text-[rgba(255,255,255,0.5)]" />
      </div>
      <div className="flex-1">
        <p className="text-[rgba(255,255,255,0.92)] text-sm font-light">{label}</p>
        <p className="text-[#5acb8a]/80 text-xs font-light">{value}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.25)]" />
    </button>
  )
}

function ActionSetting({
  icon: Icon, label, description, onClick,
}: {
  icon: typeof Download
  label: string
  description: string
  onClick?: () => void
}) {
  return (
    <button
      className="w-full flex items-center gap-4 p-4 text-left transition-all duration-400 hover:bg-[rgba(255,255,255,0.02)]"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <Icon className="w-5 h-5 text-[rgba(255,255,255,0.5)]" />
      </div>
      <div className="flex-1">
        <p className="text-[rgba(255,255,255,0.92)] text-sm font-light">{label}</p>
        <p className="text-[rgba(255,255,255,0.38)] text-xs font-light">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.25)]" />
    </button>
  )
}
