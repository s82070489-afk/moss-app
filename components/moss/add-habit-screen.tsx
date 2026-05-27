"use client"

import { useState } from "react"
import { useMoss } from "./moss-context"
import { X, Check } from "lucide-react"

interface AddHabitScreenProps {
  onClose: () => void
}

const habitIcons = [
  "🏃","🚶","🧘","💪","🤸","🏊","🚴","🧗","🥗","💤","🍎","💧","🥑","🍋","🥕","🫐","🍇","🥥","🧃","🧉",
  "🌱","🌿","🍃","🌸","🌺","🌷","🌻","🌼","🌙","☀️","⭐","🔥","🌊","☁️","⛈️","❄️","🌧️","🕯️","✨",
  "📖","✍️","🧠","💡","📝","💻","📐","🔬","📚","🎓","🗣️","🌍","📓","📔","🧪","🖋️","📘","📗","📙","📕",
  "🎨","🎵","🎹","🎬","📷","🎭","🧵","🪡","🪴","🎤","🎸","🎻","🥁","🪘","🎼","🎧","🖌️","🖍️","🧶","🪄",
  "🛁","🍵","☕","🍳","🏠","🧹","🧺","🛌","🕰️","📅","🧼","🪞","🚪","🪑","🛋️","🪟","🚿","🧴","🪥",
  "❤️","🤝","💌","😊","🙏","🌈","🐶","🐱","👨‍👩‍👧","💬","🎁","🫂","💞","💖","💓","😌","🥰","🤗","👭","👨‍👩‍👦",
  "🚀","🛰️","🛸","⏳","⌛","🗺️","🧭","🏕️","⛺","🛶","🚂","✈️","🌌","🪐","🌠","🎑","🏔️","🗻","🏞️","🌅",
  "🦋","🐝","🐢","🦉","🦌","🐇","🐿️","🦢","🕊️","🐚","🍂","🪨","🌾","🍄","🪵","🌳","🌲","🌴","🪷","🪻",
]


export function AddHabitScreen({ onClose }: AddHabitScreenProps) {
  const { addHabit } = useMoss()
  const [name, setName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("🌱")
  const [intention, setIntention] = useState("")

  const handleSubmit = () => {
    if (name.trim()) {
      addHabit({
        name: name.trim(),
        icon: selectedIcon,
        intention: intention.trim() || undefined,
      })
      onClose()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#020816] via-[#04111d] to-[#071421]" />
      
      {/* Soft ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#5acb8a]/5 blur-3xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 px-6 pt-14 pb-32">
        {/* Header */}
        <header className="flex items-start justify-between mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-extralight text-[rgba(255,255,255,0.92)] mb-2 tracking-tight">
              Plant a New Seed
            </h1>
            <p className="text-[rgba(255,255,255,0.38)] text-sm font-light">
              Begin a new journey
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-400 hover:bg-[rgba(255,255,255,0.06)]"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[rgba(255,255,255,0.6)]" />
          </button>
        </header>

        {/* Form */}
        <div className="space-y-8">
          {/* Habit name input */}
          <div className="animate-fade-in-up delay-100">
            <label className="block text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              What will you nurture?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Reading, Meditation, Walking..."
              className="w-full px-5 py-4 text-[rgba(255,255,255,0.92)] placeholder:text-[rgba(255,255,255,0.25)] font-light text-lg focus:outline-none transition-all duration-400"
              style={{
                background: 'rgba(11, 31, 42, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '1.25rem',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(90, 203, 138, 0.3)'
                e.target.style.background = 'rgba(11, 31, 42, 0.8)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                e.target.style.background = 'rgba(11, 31, 42, 0.6)'
              }}
            />
          </div>

          {/* Icon selection */}
          <div className="animate-fade-in-up delay-200">
            <label className="block text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              Choose a symbol
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {habitIcons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                 className="aspect-square min-h-[52px] rounded-xl flex items-center justify-center text-2xl transition-all duration-300"
                  style={{
                    padding: '0.4rem',
                    background: selectedIcon === icon 
                      ? 'rgba(90, 203, 138, 0.15)' 
                      : 'rgba(255, 255, 255, 0.04)',
                    border: selectedIcon === icon 
                      ? '2px solid rgba(90, 203, 138, 0.4)' 
                      : '1px solid rgba(255, 255, 255, 0.06)',
                    transform: selectedIcon === icon ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedIcon === icon 
                      ? '0 0 20px rgba(90, 203, 138, 0.2)' 
                      : 'none',
                  }}
                  aria-label={`Select ${icon} icon`}
                  aria-pressed={selectedIcon === icon}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Emotional intention */}
          <div className="animate-fade-in-up delay-300">
            <label className="block text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
              Your intention
              <span className="text-[rgba(255,255,255,0.25)] ml-2 normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="I want to become calmer..."
              rows={3}
              className="w-full px-5 py-4 text-[rgba(255,255,255,0.92)] placeholder:text-[rgba(255,255,255,0.25)] font-light text-base focus:outline-none transition-all duration-400 resize-none"
              style={{
                background: 'rgba(11, 31, 42, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '1.25rem',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(90, 203, 138, 0.3)'
                e.target.style.background = 'rgba(11, 31, 42, 0.8)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                e.target.style.background = 'rgba(11, 31, 42, 0.6)'
              }}
            />
            <p className="text-[rgba(255,255,255,0.25)] text-xs font-light mt-3 px-1">
              A gentle reminder of why this matters to you
            </p>
          </div>

          {/* Preview */}
          {name.trim() && (
            <div className="animate-fade-in-up">
              <label className="block text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-3 px-1">
                Preview
              </label>
              <div className="moss-card moss-card-glow p-5">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    {selectedIcon}
                  </div>
                  <div>
                    <h3 className="text-[rgba(255,255,255,0.92)] font-light text-lg">{name}</h3>
                    <p className="text-[rgba(255,255,255,0.38)] text-sm font-light">
                      Waiting to begin · 0 traces
                    </p>
                  </div>
                </div>
                {intention && (
                  <p className="text-[rgba(255,255,255,0.5)] text-sm font-light mt-4 italic leading-relaxed">
                    &ldquo;{intention}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-6 animate-fade-in-up delay-500">
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full py-4 rounded-[1.25rem] font-light text-lg flex items-center justify-center gap-3 transition-all duration-400"
              style={{
                background: name.trim() 
                  ? 'linear-gradient(135deg, #5acb8a 0%, #73d99f 50%, #5acb8a 100%)' 
                  : 'rgba(255, 255, 255, 0.04)',
                color: name.trim() ? '#020816' : 'rgba(255, 255, 255, 0.38)',
                boxShadow: name.trim() 
                  ? '0 4px 20px rgba(90, 203, 138, 0.3)' 
                  : 'none',
                cursor: name.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              <Check className="w-5 h-5" />
              Plant this seed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
