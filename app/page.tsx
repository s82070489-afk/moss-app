"use client"

import { useState, useEffect, useRef } from "react"
import { HomeScreen } from "@/components/moss/home-screen"
import { ForestScreen } from "@/components/moss/forest-screen"
import { AddHabitScreen } from "@/components/moss/add-habit-screen"
import { ReflectionScreen } from "@/components/moss/reflection-screen"
import { SettingsScreen } from "@/components/moss/settings-screen"
import { Navigation } from "@/components/moss/navigation"
import { MossProvider, useMoss } from "@/components/moss/moss-context"

export type Screen = "home" | "forest" | "add" | "reflection" | "settings"

// ✅ 앱 전체에서 소리를 관리하는 컴포넌트 — MossProvider 안에 있어야 settings 읽을 수 있음
function AmbientSound() {
  const { settings } = useMoss()
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)

  useEffect(() => {
    if (settings.ambientSound) {
      try {
        const ctx = new AudioContext()
        audioCtxRef.current = ctx

        const bufferSize = ctx.sampleRate * 3
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.08
        }

        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.loop = true
        sourceRef.current = source

        const filter = ctx.createBiquadFilter()
        filter.type = "lowpass"
        filter.frequency.value = 400

        const gain = ctx.createGain()
        gain.gain.value = 0
        gainRef.current = gain

        source.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        source.start()

        // 페이드인
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 2)
      } catch {
        // 브라우저 정책상 실패 시 조용히 넘어감
      }
    } else {
      // 페이드아웃 후 종료
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1)
        setTimeout(() => {
          sourceRef.current?.stop()
          audioCtxRef.current?.close()
          sourceRef.current = null
          audioCtxRef.current = null
          gainRef.current = null
        }, 1200)
      }
    }

    return () => {
      sourceRef.current?.stop()
      audioCtxRef.current?.close()
      sourceRef.current = null
      audioCtxRef.current = null
      gainRef.current = null
    }
  }, [settings.ambientSound])

  return null
}

function MossApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [previousScreen, setPreviousScreen] = useState<Screen>("home")

  const handleNavigate = (screen: Screen) => {
    setPreviousScreen(currentScreen)
    setCurrentScreen(screen)
  }

  const handleCloseAdd = () => {
    setCurrentScreen(previousScreen === "add" ? "home" : previousScreen)
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* 앱 전체 ambient sound */}
      <AmbientSound />

      {/* Ambient background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-1 h-1 rounded-full bg-primary/30 animate-particle delay-100" style={{ left: '10%', top: '80%' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-accent/20 animate-particle delay-500" style={{ left: '25%', top: '90%' }} />
        <div className="absolute w-1 h-1 rounded-full bg-primary/25 animate-particle delay-1000" style={{ left: '45%', top: '85%' }} />
        <div className="absolute w-0.5 h-0.5 rounded-full bg-moonlight/20 animate-particle delay-2000" style={{ left: '65%', top: '95%' }} />
        <div className="absolute w-1 h-1 rounded-full bg-teal/30 animate-particle delay-3000" style={{ left: '80%', top: '88%' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-primary/20 animate-particle delay-700" style={{ left: '90%', top: '82%' }} />
      </div>

      <main className="pb-28">
        {currentScreen === "home" && <HomeScreen onNavigate={handleNavigate} />}
        {currentScreen === "forest" && <ForestScreen />}
        {currentScreen === "add" && <AddHabitScreen onClose={handleCloseAdd} />}
        {currentScreen === "reflection" && <ReflectionScreen />}
        {currentScreen === "settings" && <SettingsScreen />}
      </main>

      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
    </div>
  )
}

export default function MossRoot() {
  return (
    <MossProvider>
      <MossApp />
    </MossProvider>
  )
}
