"use client"

import { useMoss } from "./moss-context"
import { useTranslation, LANGUAGE_LABELS, Language } from "@/lib/i18n"
import { Moon, Volume2, Bell, Download, Upload, MessageCircle, ChevronRight } from "lucide-react"
import { useRef, useState } from "react"

export function SettingsScreen() {
  const { settings, updateSettings, habits, totalActions, importData } = useMoss()
  const tx = useTranslation(settings.language)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importMessage, setImportMessage] = useState<{ text: string; ok: boolean } | null>(null)

  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
      summary: { totalHabits: habits.length, totalTraces: totalActions },
      habits: habits.map(h => ({
        id: h.id,
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

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const json = event.target?.result as string
      const result = importData(json)
      setImportMessage({ text: result.message, ok: result.success })
      setTimeout(() => setImportMessage(null), 3000)
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleNotificationRequest = async () => {
    if (!("Notification" in window)) return
    if (Notification.permission === "granted") {
      new Notification("Moss 🌿", { body: "Your forest is waiting. Time to leave a trace." })
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        new Notification("Moss 🌿", { body: "Notifications enabled. Your forest will remind you gently." })
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-[#020816] via-[#04111d] to-[#071421]" />

      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

      <div className="relative z-10 px-6 pt-14 pb-32">
        <header className="mb-10 animate-fade-in-up">
          <h1 className="text-2xl font-extralight text-[rgba(255,255,255,0.92)] mb-2 tracking-tight">
            {tx.settings}
          </h1>
          <p className="text-[rgba(255,255,255,0.38)] text-sm font-light">{tx.customizeSanctuary}</p>
        </header>

        <div className="space-y-8">
          {/* Atmosphere */}
          <section className="animate-fade-in-up delay-100">
            <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              {tx.atmosphere}
            </p>
            <div className="moss-card overflow-hidden">
              <ToggleSetting
                icon={Moon}
                label={tx.darkMode}
                description={tx.darkModeDesc}
                checked={settings.darkMode}
                onChange={(v) => updateSettings({ darkMode: v })}
                disabled
              />
              <Divider />
              <ToggleSetting
                icon={Volume2}
                label={tx.ambientSound}
                description={tx.ambientSoundDesc}
                checked={settings.ambientSound}
                onChange={(v) => updateSettings({ ambientSound: v })}
              />
            </div>
          </section>

          {/* Language */}
          <section className="animate-fade-in-up delay-150">
            <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              {tx.language}
            </p>
            <div className="moss-card overflow-hidden">
              <div className="grid grid-cols-3 gap-0">
                {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang, i) => (
                  <button
                    key={lang}
                    onClick={() => updateSettings({ language: lang })}
                    className="py-3 px-2 text-center transition-all duration-300"
                    style={{
                      backgroundColor: settings.language === lang ? "rgba(90,203,138,0.1)" : "transparent",
                      borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                  >
                    <p className="text-sm font-light"
                      style={{ color: settings.language === lang ? "#5acb8a" : "rgba(255,255,255,0.7)" }}>
                      {LANGUAGE_LABELS[lang]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="animate-fade-in-up delay-200">
            <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              {tx.notifications}
            </p>
            <div className="moss-card overflow-hidden">
              <ActionSetting
                icon={Bell}
                label={tx.enableReminders}
                description={typeof window !== "undefined" && Notification.permission === "granted" ? tx.remindersActive : tx.remindersHint}
                onClick={handleNotificationRequest}
              />
              <Divider />
              <SelectSetting
                icon={MessageCircle}
                label={tx.emotionalMessages}
                value={settings.emotionalMessages === "frequent" ? "Frequent" : settings.emotionalMessages === "occasional" ? "Occasional" : "Rare"}
                options={["Frequent", "Occasional", "Rare"]}
                onSelect={(v) => updateSettings({ emotionalMessages: v.toLowerCase() as "frequent" | "occasional" | "rare" })}
              />
            </div>
          </section>

          {/* Data */}
          <section className="animate-fade-in-up delay-300">
            <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              {tx.data}
            </p>
            <div className="moss-card overflow-hidden">
              <ActionSetting icon={Download} label={tx.exportForest} description={tx.exportDesc} onClick={handleExport} />
              <Divider />
              <ActionSetting icon={Upload} label={tx.importForest} description={tx.importDesc} onClick={handleImportClick} />
            </div>
            {importMessage && (
              <div className="mt-3 px-4 py-3 rounded-2xl text-sm font-light text-center"
                style={{
                  backgroundColor: importMessage.ok ? "rgba(90,203,138,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${importMessage.ok ? "rgba(90,203,138,0.2)" : "rgba(239,68,68,0.2)"}`,
                  color: importMessage.ok ? "#5acb8a" : "rgba(239,68,68,0.8)",
                }}>
                {importMessage.text}
              </div>
            )}
          </section>

          {/* About */}
          <section className="animate-fade-in-up delay-500">
            <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              {tx.about}
            </p>
            <div className="moss-card p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                  style={{ background: "rgba(90,203,138,0.1)", border: "1px solid rgba(90,203,138,0.2)", boxShadow: "0 0 30px rgba(90,203,138,0.15)" }}>
                  <svg viewBox="0 0 40 50" className="w-8 h-10">
                    <rect x="17" y="35" width="6" height="15" rx="1" fill="rgba(90,203,138,0.4)" />
                    <ellipse cx="20" cy="28" rx="16" ry="12" fill="rgba(90,203,138,0.5)" />
                    <ellipse cx="20" cy="18" rx="12" ry="10" fill="rgba(90,203,138,0.6)" />
                    <ellipse cx="20" cy="10" rx="8" ry="7" fill="rgba(90,203,138,0.7)" />
                  </svg>
                </div>
                <h3 className="text-[rgba(255,255,255,0.92)] font-extralight text-xl mb-1">Moss</h3>
                <p className="text-[rgba(255,255,255,0.38)] text-xs font-light mb-5">{tx.version} 1.0.0</p>
                <p className="text-[rgba(255,255,255,0.5)] text-sm font-light leading-relaxed max-w-xs mx-auto">
                  A calm emotional space where small repeated actions slowly grow into a living memory forest.
                </p>
                <a href="/privacy" className="mt-4 inline-block text-[rgba(255,255,255,0.25)] text-xs font-light underline underline-offset-2">
                  Privacy Policy
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center animate-fade-in-up delay-700">
          <p className="text-[rgba(255,255,255,0.25)] text-xs font-light tracking-wide">{tx.madeWith}</p>
        </div>
      </div>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-[rgba(255,255,255,0.04)] mx-4" />
}

function ToggleSetting({ icon: Icon, label, description, checked, onChange, disabled = false }:
  { icon: typeof Moon; label: string; description: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
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
      <button onClick={() => !disabled && onChange(!checked)} disabled={disabled}
        className="relative w-12 h-7 rounded-full transition-all duration-400"
        style={{ backgroundColor: checked ? "rgba(90,203,138,0.5)" : "rgba(255,255,255,0.08)", opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
        role="switch" aria-checked={checked} aria-label={label}>
        <div className="absolute top-1 w-5 h-5 rounded-full transition-transform duration-400"
          style={{ backgroundColor: checked ? "#5acb8a" : "rgba(255,255,255,0.6)", transform: checked ? "translateX(24px)" : "translateX(4px)", boxShadow: checked ? "0 0 8px rgba(90,203,138,0.5)" : "none" }} />
      </button>
    </div>
  )
}

function SelectSetting({ icon: Icon, label, value, options, onSelect }:
  { icon: typeof Bell; label: string; value: string; options?: string[]; onSelect?: (v: string) => void }) {
  return (
    <button className="w-full flex items-center gap-4 p-4 text-left transition-all duration-400 hover:bg-[rgba(255,255,255,0.02)]"
      onClick={() => { if (options && onSelect) { const i = options.indexOf(value); onSelect(options[(i + 1) % options.length]) } }}>
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

function ActionSetting({ icon: Icon, label, description, onClick }:
  { icon: typeof Download; label: string; description: string; onClick?: () => void }) {
  return (
    <button className="w-full flex items-center gap-4 p-4 text-left transition-all duration-400 hover:bg-[rgba(255,255,255,0.02)]" onClick={onClick}>
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
