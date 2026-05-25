"use client"

import { useMoss } from "./moss-context"
import { getTreeStage, getTreeStageLabel } from "@/lib/tree-utils"

function getTreePosition(index: number, total: number): { x: number; z: number } {
  const maxSpread = Math.min(120, 60 + total * 8)
  const step = total > 1 ? (maxSpread * 2) / (total - 1) : 0
  const centerOffset = index * step - maxSpread
  const jitter = Math.sin(index * 2.5) * Math.min(10, 80 / total)
  const x = centerOffset + jitter
  const z = Math.cos(index * 1.8) * 0.3 + 0.5
  return { x, z }
}

export function ForestScreen() {
  const { habits, totalActions } = useMoss()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Deep night sky gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#020816] via-[#04111d] to-[#071421]" />
      
      {/* Stars layer */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${1 + (i % 2)}px`,
              height: `${1 + (i % 2)}px`,
              left: `${(i * 13) % 100}%`,
              top: `${(i * 7) % 35}%`,
              opacity: 0.3 + (i % 3) * 0.2,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div className="fixed top-20 right-10 pointer-events-none">
        <div className="relative">
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-[#9ecfff]/10 blur-3xl animate-glow-pulse" />
          <div className="absolute inset-2 w-16 h-16 rounded-full bg-[#9ecfff]/15 blur-xl" />
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9ecfff]/30 to-[#9ecfff]/10" />
        </div>
      </div>

      {/* Ambient fog layers */}
      <div className="fixed inset-x-0 bottom-0 h-44 pointer-events-none translate-y-3">
        <div className="absolute inset-0 bg-gradient-to-t from-[#5acb8a]/6 via-[#5acb8a]/3 to-transparent animate-fog-drift" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071421]/90 via-transparent to-transparent" />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-particle"
            style={{
              left: `${5 + (i * 5) % 90}%`,
              bottom: `${10 + (i * 3) % 30}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${8 + (i % 4)}s`,
            }}
          >
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: i % 4 === 0 ? '#f2d7a1' : i % 3 === 0 ? '#9ecfff' : '#5acb8a',
                boxShadow: i % 4 === 0 
                  ? '0 0 6px rgba(242, 215, 161, 0.8)' 
                  : i % 3 === 0 
                  ? '0 0 6px rgba(158, 207, 255, 0.6)' 
                  : '0 0 6px rgba(90, 203, 138, 0.6)',
                opacity: 0.6 + (i % 3) * 0.2,
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pt-14 pb-32">
        <header className="mb-6 animate-fade-in-up">
          <h1 className="text-2xl font-extralight text-[rgba(255,255,255,0.92)] mb-2 tracking-tight">
            Your Forest
          </h1>
          <p className="text-[rgba(255,255,255,0.38)] text-sm font-light">
            A living memory of your journey
          </p>
        </header>

        {/* Forest visualization */}
        <div className="relative h-[420px] mb-8 animate-fade-in-up delay-200 overflow-visible">
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#0b1f2a]/45 via-[#0b1f2a]/20 to-transparent rounded-b-3xl" />
          <div className="absolute bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#5acb8a]/20 to-transparent" />
          
          <div className="absolute bottom-8 left-0 right-0 flex items-end justify-center overflow-visible">
            {habits.map((habit, index) => {
              const position = getTreePosition(index, habits.length)
              return (
                <ForestTree
                  key={habit.id}
                  habit={habit}
                  position={position}
                  index={index}
                />
              )
            })}
          </div>
        </div>

        {/* Forest memory stats */}
        <div className="space-y-4 animate-fade-in-up delay-400">
          <div className="moss-card p-6">
            <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-4">
              Forest Memory
            </p>
            <p className="text-[rgba(255,255,255,0.92)] text-4xl font-extralight mb-2">{totalActions}</p>
            <p className="text-[rgba(255,255,255,0.6)] text-sm font-light">
              traces have been left in your forest
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="moss-card p-4">
              <p className="text-[rgba(255,255,255,0.38)] text-xs font-light mb-2">Trees Growing</p>
              <p className="text-[rgba(255,255,255,0.92)] text-2xl font-extralight">{habits.length}</p>
            </div>
            <div className="moss-card p-4">
              <p className="text-[rgba(255,255,255,0.38)] text-xs font-light mb-2">Oldest Tree</p>
              <p className="text-[rgba(255,255,255,0.92)] text-2xl font-extralight">
                {habits.length > 0 ? Math.max(...habits.map(h => h.count)) : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Tree list */}
        <div className="mt-8 space-y-3 animate-fade-in-up delay-600">
          <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-4 px-1">
            Your Trees
          </p>
          {habits.map((habit, index) => (
            <div
              key={habit.id}
              className="moss-card p-4 flex items-center gap-4"
              style={{ animationDelay: `${700 + index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-lg border border-[rgba(255,255,255,0.04)]">
                {habit.icon}
              </div>
              <div className="flex-1">
                <p className="text-[rgba(255,255,255,0.92)] text-sm font-light">{habit.name}</p>
                <p className="text-[rgba(255,255,255,0.38)] text-xs font-light">
                  {getTreeStageLabel(getTreeStage(habit.count))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#5acb8a] text-sm font-light">{habit.count}</p>
                <p className="text-[rgba(255,255,255,0.38)] text-xs font-light">traces</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ForestTree({ 
  habit, 
  position,
  index
}: { 
  habit: { id: string; name: string; count: number; icon: string }
  position: { x: number; z: number }
  index: number
}) {
  const stage = getTreeStage(habit.count)
  
  const sizes = {
    seed:    { height: 20, width: 16 },
    sprout:  { height: 40, width: 28 },
    young:   { height: 70, width: 44 },
    growing: { height: 100, width: 56 },
    mature:  { height: 130, width: 72 },
    ancient: { height: 160, width: 88 },
  }

  const { height, width } = sizes[stage]
  const scale = 0.6 + position.z * 0.5
  const opacity = 0.5 + position.z * 0.5

  return (
    <div 
      className="absolute animate-sway"
      style={{ 
        left: `calc(50% + ${position.x}px)`,
        transform: `translateX(-50%) scale(${scale})`,
        zIndex: Math.floor(position.z * 10),
        animationDelay: `${index * 0.4}s`,
      }}
    >
      {habit.count >= 50 && (
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full animate-glow-pulse rounded-full blur-xl"
          style={{ 
            height: height * 0.5,
            width: width * 1.5,
            backgroundColor: 'rgba(90, 203, 138, 0.15)',
            animationDelay: `${index * 0.3}s` 
          }}
        />
      )}
      
      <svg 
        viewBox="0 -20 100 200" 
        style={{ height, width, opacity }}
        className="transition-all duration-1000"
      >
        {stage === "seed" && (
          <g>
            <ellipse cx="50" cy="165" rx="10" ry="6" fill="rgba(90, 203, 138, 0.3)" />
            <circle cx="50" cy="155" r="8" fill="rgba(90, 203, 138, 0.6)" />
          </g>
        )}
        {stage === "sprout" && (
          <g>
            <rect x="47" y="140" width="6" height="35" rx="1" fill="rgba(90, 203, 138, 0.4)" />
            <ellipse cx="50" cy="130" rx="18" ry="15" fill="rgba(90, 203, 138, 0.5)" />
            <ellipse cx="50" cy="118" rx="12" ry="10" fill="rgba(90, 203, 138, 0.6)" />
          </g>
        )}
        {stage === "young" && (
          <g>
            <rect x="44" y="130" width="12" height="45" rx="2" fill="rgba(70, 140, 100, 0.5)" />
            <ellipse cx="50" cy="110" rx="28" ry="22" fill="rgba(90, 203, 138, 0.45)" />
            <ellipse cx="50" cy="85" rx="22" ry="18" fill="rgba(90, 203, 138, 0.55)" />
            <ellipse cx="50" cy="65" rx="15" ry="14" fill="rgba(90, 203, 138, 0.65)" />
          </g>
        )}
        {stage === "growing" && (
          <g>
            <rect x="42" y="120" width="16" height="55" rx="2" fill="rgba(60, 120, 85, 0.5)" />
            <ellipse cx="50" cy="95" rx="35" ry="26" fill="rgba(90, 203, 138, 0.4)" />
            <ellipse cx="50" cy="68" rx="28" ry="22" fill="rgba(90, 203, 138, 0.5)" />
            <ellipse cx="50" cy="45" rx="20" ry="18" fill="rgba(90, 203, 138, 0.6)" />
            <ellipse cx="50" cy="28" rx="12" ry="12" fill="rgba(115, 217, 159, 0.7)" />
          </g>
        )}
        {stage === "mature" && (
          <g>
            <rect x="40" y="110" width="20" height="65" rx="3" fill="rgba(50, 100, 75, 0.55)" />
            <ellipse cx="50" cy="85" rx="42" ry="30" fill="rgba(90, 203, 138, 0.35)" />
            <ellipse cx="50" cy="55" rx="35" ry="26" fill="rgba(90, 203, 138, 0.45)" />
            <ellipse cx="50" cy="30" rx="26" ry="22" fill="rgba(90, 203, 138, 0.55)" />
            <ellipse cx="50" cy="12" rx="16" ry="14" fill="rgba(115, 217, 159, 0.65)" />
          </g>
        )}
        {stage === "ancient" && (
          <g>
            <rect x="36" y="100" width="28" height="75" rx="4" fill="rgba(45, 90, 65, 0.6)" />
            <ellipse cx="50" cy="75" rx="48" ry="35" fill="rgba(90, 203, 138, 0.3)" />
            <ellipse cx="50" cy="50" rx="42" ry="30" fill="rgba(90, 203, 138, 0.4)" />
            <ellipse cx="50" cy="28" rx="34" ry="25" fill="rgba(90, 203, 138, 0.5)" />
            <ellipse cx="50" cy="10" rx="24" ry="18" fill="rgba(115, 217, 159, 0.6)" />
            <ellipse cx="50" cy="5" rx="12" ry="10" fill="rgba(138, 230, 179, 0.7)" />
          </g>
        )}
      </svg>

      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-sm" style={{ opacity: opacity * 0.8 }}>
        {habit.icon}
      </div>
    </div>
  )
}
