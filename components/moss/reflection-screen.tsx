"use client"

import { useMoss } from "./moss-context"

// 날짜 키 생성 — "2026-05-24" (로컬 날짜 기준, UTC 오류 방지)
function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

// 며칠 전 날짜 키
function daysAgoKey(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return dateKey(d)
}

// 최근 5주(35일) 날짜 배열 — 오래된 순
function getLast35Days(): string[] {
  return Array.from({ length: 35 }, (_, i) => daysAgoKey(34 - i))
}

export function ReflectionScreen() {
  const { habits, totalActions } = useMoss()

  if (habits.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-b from-[#020816] via-[#04111d] to-[#071421]" />
        <div className="relative z-10 text-center px-8">
          <p className="text-[rgba(255,255,255,0.38)] text-lg font-extralight leading-relaxed">
            Your forest is empty.<br />
            <span className="text-sm">Plant your first habit to begin.</span>
          </p>
        </div>
      </div>
    )
  }

  // 오늘 / 이번 주 기록
  const todayStr = dateKey(new Date())
  const todayTotal = habits.reduce((sum, h) => sum + (h.dailyLog[todayStr] ?? 0), 0)

  const last7Keys = Array.from({ length: 7 }, (_, i) => daysAgoKey(i))
  const thisWeekTotal = habits.reduce((sum, h) =>
    sum + last7Keys.reduce((s, k) => s + (h.dailyLog[k] ?? 0), 0), 0)

  // 가장 많이 기록한 습관
  const mostGrown = [...habits].sort((a, b) => b.count - a.count)[0]

  // 연속 기록일 계산 (전체 합산 기준)
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const key = daysAgoKey(i)
    const dayTotal = habits.reduce((sum, h) => sum + (h.dailyLog[key] ?? 0), 0)
    if (dayTotal > 0) streak++
    else break
  }

  // 히트맵 — 최근 35일
  const last35 = getLast35Days()
  // 5주 × 7일 구조로 변환
  const weeks: string[][] = []
  for (let w = 0; w < 5; w++) {
    weeks.push(last35.slice(w * 7, w * 7 + 7))
  }

  // 날짜별 전체 활동량
  function dayActivity(key: string): number {
    return habits.reduce((sum, h) => sum + (h.dailyLog[key] ?? 0), 0)
  }

  const maxActivity = Math.max(...last35.map(dayActivity), 1)

  // 최근 기록들 (lastUpdated 기준 정렬)
  const recentHabits = [...habits]
    .filter(h => h.lastUpdated)
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 4)

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#020816] via-[#04111d] to-[#071421]" />

      {/* Fireflies */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-firefly"
            style={{
              left: `${15 + (i * 10) % 70}%`,
              top: `${20 + (i * 8) % 50}%`,
              backgroundColor: i % 2 === 0 ? '#5acb8a' : '#f2d7a1',
              animationDelay: `${i * 0.8}s`,
              boxShadow: i % 2 === 0
                ? '0 0 6px rgba(90, 203, 138, 0.6)'
                : '0 0 6px rgba(242, 215, 161, 0.6)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 pt-14 pb-32">

        {/* Header */}
        <header className="mb-10 animate-fade-in-up">
          <h1 className="text-2xl font-extralight text-[rgba(255,255,255,0.92)] mb-2 tracking-tight">
            Reflection
          </h1>
          <p className="text-[rgba(255,255,255,0.38)] text-sm font-light">
            Quiet moments of remembering
          </p>
        </header>

        {/* 감성 요약 카드 */}
        <div className="moss-card moss-card-glow p-6 mb-5 animate-fade-in-up delay-100">
          {todayTotal > 0 ? (
            <p className="text-[rgba(255,255,255,0.92)] text-lg font-extralight leading-relaxed">
              Today you left{" "}
              <span className="text-[#5acb8a]">{todayTotal} {todayTotal === 1 ? "trace" : "traces"}</span>{" "}
              in your forest.
            </p>
          ) : (
            <p className="text-[rgba(255,255,255,0.92)] text-lg font-extralight leading-relaxed">
              No traces yet today.{" "}
              <span className="text-[rgba(255,255,255,0.5)]">Your forest is waiting.</span>
            </p>
          )}
          {mostGrown && (
            <p className="text-[rgba(255,255,255,0.5)] text-sm font-light mt-4 leading-relaxed">
              Your{" "}
              <span className="text-[rgba(255,255,255,0.8)]">{mostGrown.name}</span>{" "}
              tree has grown the tallest — {mostGrown.count} traces deep.
            </p>
          )}
        </div>

        {/* 통계 3개 */}
        <div className="grid grid-cols-3 gap-3 mb-5 animate-fade-in-up delay-150">
          <div className="moss-card p-4 text-center">
            <p className="text-[#5acb8a] text-2xl font-extralight">{thisWeekTotal}</p>
            <p className="text-[rgba(255,255,255,0.38)] text-[10px] tracking-widest uppercase mt-1">This week</p>
          </div>
          <div className="moss-card p-4 text-center">
            <p className="text-[#9ecfff] text-2xl font-extralight">{streak}</p>
            <p className="text-[rgba(255,255,255,0.38)] text-[10px] tracking-widest uppercase mt-1">Day streak</p>
          </div>
          <div className="moss-card p-4 text-center">
            <p className="text-[#f2d7a1] text-2xl font-extralight">{totalActions}</p>
            <p className="text-[rgba(255,255,255,0.38)] text-[10px] tracking-widest uppercase mt-1">All time</p>
          </div>
        </div>

        {/* 히트맵 */}
        <div className="moss-card p-5 mb-5 animate-fade-in-up delay-200">
          <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-5">
            Your Traces — Last 5 Weeks
          </p>

          <div className="flex gap-2">
            {/* 요일 레이블 */}
            <div className="flex flex-col gap-1.5 mr-1">
              {dayLabels.map((label, i) => (
                <div key={i} className="h-5 flex items-center">
                  <span className="text-[rgba(255,255,255,0.25)] text-[10px] font-light w-3">{label}</span>
                </div>
              ))}
            </div>

            {/* 히트맵 그리드 */}
            <div className="flex gap-1.5 flex-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1.5 flex-1">
                  {week.map((dayK, di) => {
                    const act = dayActivity(dayK)
                    const intensity = act === 0 ? 0 : Math.min(act / maxActivity, 1)
                    const isToday = dayK === todayStr
                    return (
                      <div
                        key={di}
                        className="aspect-square rounded-md transition-all duration-400"
                        style={{
                          backgroundColor: act === 0
                            ? "rgba(255,255,255,0.04)"
                            : `rgba(90, 203, 138, ${0.15 + intensity * 0.7})`,
                          boxShadow: act > 0
                            ? `0 0 ${intensity * 8}px rgba(90, 203, 138, ${intensity * 0.4})`
                            : isToday
                            ? "0 0 0 1px rgba(255,255,255,0.15)"
                            : "none",
                          outline: isToday ? "1px solid rgba(158,207,255,0.3)" : "none",
                        }}
                        title={`${dayK}: ${act} traces`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-[rgba(255,255,255,0.25)] text-[10px]">Less</span>
            {[0, 0.3, 0.6, 1].map((v, i) => (
              <div key={i} className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: v === 0 ? "rgba(255,255,255,0.04)" : `rgba(90,203,138,${0.15 + v * 0.7})` }}
              />
            ))}
            <span className="text-[rgba(255,255,255,0.25)] text-[10px]">More</span>
          </div>
        </div>

        {/* 습관별 메모리 카드 */}
        <div className="space-y-3 animate-fade-in-up delay-300">
          <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase px-1 mb-4">
            Memories
          </p>
          {habits.slice(0, 3).map((habit, index) => {
            const weekCount = last7Keys.reduce((s, k) => s + (habit.dailyLog[k] ?? 0), 0)
            return (
              <div
                key={habit.id}
                className="moss-card p-4"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-xl mt-0.5">{habit.icon}</div>
                  <div className="flex-1">
                    <p className="text-[rgba(255,255,255,0.85)] text-sm font-light leading-relaxed">
                      {getEmotionalNote(habit.name, habit.count)}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <p className="text-[rgba(255,255,255,0.25)] text-xs font-light">
                        {habit.count} total
                      </p>
                      {weekCount > 0 && (
                        <p className="text-[#5acb8a] text-xs font-light">
                          +{weekCount} this week
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 최근 기록 타임라인 */}
        <div className="mt-10 animate-fade-in-up delay-500">
          <p className="text-[rgba(255,255,255,0.38)] text-xs font-light tracking-[0.1em] uppercase mb-5 px-1">
            Recent Traces
          </p>
          <div className="relative pl-5">
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-[#5acb8a]/40 via-[#5acb8a]/20 to-transparent" />
            {recentHabits.map((habit, index) => {
              const lastDate = new Date(habit.lastUpdated)
              const diffMs = Date.now() - lastDate.getTime()
              const diffHours = Math.floor(diffMs / 3600000)
              const diffDays = Math.floor(diffMs / 86400000)
              const timeLabel = diffHours < 1
                ? "Just now"
                : diffHours < 24
                ? `${diffHours}h ago`
                : diffDays === 1
                ? "Yesterday"
                : `${diffDays} days ago`

              return (
                <div key={habit.id} className="relative mb-6 last:mb-0">
                  <div
                    className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-[#5acb8a]"
                    style={{
                      boxShadow: '0 0 8px rgba(90, 203, 138, 0.5)',
                      opacity: 1 - index * 0.2
                    }}
                  />
                  <div className="pl-4">
                    <p className="text-[rgba(255,255,255,0.85)] text-sm font-light">
                      {habit.icon} {habit.name}
                    </p>
                    <p className="text-[rgba(255,255,255,0.38)] text-xs font-light mt-1">
                      {timeLabel} · a trace was left
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 마무리 메시지 */}
        <div className="mt-12 text-center animate-fade-in-up delay-700">
          <p className="text-[rgba(255,255,255,0.38)] text-sm font-light italic leading-relaxed">
            &ldquo;Every small action becomes part of who you are.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}

function getEmotionalNote(habitName: string, count: number): string {
  if (count >= 200) {
    return `Your ${habitName.toLowerCase()} practice has become deeply rooted. This ancient tree stands as a guardian in your forest.`
  }
  if (count >= 50) {
    return `Through ${habitName.toLowerCase()}, you have been quietly transforming. The growth is real and lasting.`
  }
  if (count >= 10) {
    return `${habitName} is finding its place in your forest. Keep nurturing this gentle seedling.`
  }
  return `A quiet beginning with ${habitName.toLowerCase()}. Every journey starts with these small, careful steps.`
}
