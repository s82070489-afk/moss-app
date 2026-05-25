"use client"

import type { Screen } from "@/app/page"
import { Home, TreePine, Plus, Heart, Settings } from "lucide-react"

interface NavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const navItems: { screen: Screen; icon: typeof Home; label: string }[] = [
    { screen: "home", icon: Home, label: "Home" },
    { screen: "forest", icon: TreePine, label: "Forest" },
    { screen: "add", icon: Plus, label: "Add" },
    { screen: "reflection", icon: Heart, label: "Reflect" },
    { screen: "settings", icon: Settings, label: "Settings" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Subtle moss green ground line */}
      <div className="absolute inset-x-0 bottom-full h-[1px] bg-gradient-to-r from-transparent via-[#5acb8a]/30 to-transparent" />
      
      {/* Navigation bar container */}
      <div className="px-4 pb-4" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}>
        {/* Floating glass navigation bar */}
        <div 
          className="mx-auto max-w-sm rounded-[1.75rem] px-2 py-2"
          style={{
            background: 'rgba(11, 31, 42, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="flex items-center justify-between">
            {navItems.map(({ screen, icon: Icon, label }) => {
              const isActive = currentScreen === screen
              const isAdd = screen === "add"

              if (isAdd) {
                return (
                  <button
                    key={screen}
                    onClick={() => onNavigate(screen)}
                    className="relative -mt-8 mx-2"
                    aria-label={label}
                  >
                    {/* Outer glow ring */}
                    <div 
                      className="absolute inset-0 rounded-full animate-glow-pulse"
                      style={{
                        background: 'radial-gradient(circle, rgba(90, 203, 138, 0.3) 0%, transparent 70%)',
                        transform: 'scale(1.8)',
                      }}
                    />
                    {/* Main button - glowing moss orb */}
                    <div 
                      className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-400 hover:scale-105 active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, #5acb8a 0%, #73d99f 50%, #5acb8a 100%)',
                        boxShadow: '0 4px 20px rgba(90, 203, 138, 0.4), 0 0 40px rgba(90, 203, 138, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <Icon className="w-6 h-6 text-[#020816]" />
                    </div>
                  </button>
                )
              }

              return (
                <button
                  key={screen}
                  onClick={() => onNavigate(screen)}
                  className="relative flex flex-col items-center gap-1 px-4 py-2 transition-all duration-400"
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-400 ${
                      isActive ? "text-[#5acb8a]" : "text-[rgba(255,255,255,0.38)]"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-light tracking-wide transition-all duration-400 ${
                      isActive ? "text-[rgba(255,255,255,0.92)]" : "text-[rgba(255,255,255,0.38)]"
                    }`}
                  >
                    {label}
                  </span>
                  
                  {/* Active indicator glow */}
                  {isActive && (
                    <div 
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#5acb8a] animate-glow-pulse"
                      style={{ boxShadow: '0 0 8px rgba(90, 203, 138, 0.8)' }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
