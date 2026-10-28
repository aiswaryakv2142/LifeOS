
import { useEffect, useState } from 'react'
import { Cloud, Moon, Sparkles, Sun } from 'lucide-react'

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  return 'night'
}

const scenes = {
  morning: {
    label: 'A gentle morning',
    message: 'A fresh start is waiting for you.',
    icon: Sun,
    sky: 'from-[#f8e8c9] via-[#f7eafb] to-[#e5f0e5]',
    orb: 'bg-[#f5c96f]',
  },
  afternoon: {
    label: 'Your afternoon pause',
    message: 'Take a breath. You are making progress.',
    icon: Sun,
    sky: 'from-[#e4edfc] via-[#f3eafb] to-[#e2f0e5]',
    orb: 'bg-[#f4d58d]',
  },
  evening: {
    label: 'A softer evening',
    message: 'You have done enough for this moment.',
    icon: Sun,
    sky: 'from-[#f7d9c9] via-[#eadcf6] to-[#dcdcf1]',
    orb: 'bg-[#edb39a]',
  },
  night: {
    label: 'A peaceful night',
    message: 'Rest is part of your progress, too.',
    icon: Moon,
    sky: 'from-[#292c50] via-[#51476e] to-[#8b779e]',
    orb: 'bg-[#f5edcf]',
  },
}

export default function TimeScene() {
  const [time, setTime] = useState<TimeOfDay>(getTimeOfDay)

  useEffect(() => {
    const updateTime = () => setTime(getTimeOfDay())

    const interval = window.setInterval(updateTime, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const scene = scenes[time]
  const Icon = scene.icon
  const isNight = time === 'night'

  return (
    <section
      className={`time-scene relative isolate overflow-hidden rounded-[24px] border border-white/70 bg-gradient-to-br ${scene.sky} p-5 shadow-sm sm:p-7`}
      aria-label={`${scene.label}. ${scene.message}`}
    >
      <div className="time-scene-stars" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className={`time-scene-star star-${index + 1}`}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-[155px] items-center justify-between gap-4 sm:min-h-[170px]">
        <div className="max-w-[65%]">
          <div
            className={`mb-3 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/45 px-3 py-1.5 text-xs font-medium ${
              isNight ? 'text-white' : 'text-[#706187]'
            }`}
          >
            <Icon size={14} />
            {scene.label}
          </div>

          <h2
            className={`display-font text-xl font-semibold leading-snug sm:text-2xl ${
              isNight ? 'text-white' : 'text-[#433653]'
            }`}
          >
            {scene.message}
          </h2>

          <p
            className={`mt-2 text-xs ${
              isNight ? 'text-white/70' : 'text-[#766b85]'
            }`}
          >
            A little reminder to meet yourself where you are.
          </p>
        </div>

        <div
          className={`time-scene-orb relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full sm:h-28 sm:w-28 ${scene.orb}`}
          aria-hidden="true"
        >
          {isNight ? (
            <Moon size={42} className="text-[#8a7d9f] sm:h-14 sm:w-14" />
          ) : (
            <Sun
              size={43}
              strokeWidth={1.3}
              className="text-white sm:h-14 sm:w-14"
            />
          )}
          <span className="time-scene-orb-glow" />
        </div>
      </div>

      <div
        className={`time-scene-hill time-scene-hill-back ${
          isNight ? 'opacity-30' : 'opacity-70'
        }`}
        aria-hidden="true"
      />
      <div className="time-scene-hill time-scene-hill-front" aria-hidden="true" />

      <div
        className={`absolute bottom-4 right-5 z-10 flex items-center gap-1.5 text-[10px] ${
          isNight ? 'text-white/70' : 'text-[#796a89]'
        }`}
      >
        <Sparkles size={12} />
        Your day, your pace
      </div>

      <Cloud
        className={`time-scene-cloud absolute right-[34%] top-7 h-7 w-7 ${
          isNight ? 'text-white/20' : 'text-white/75'
        }`}
        strokeWidth={1.2}
        aria-hidden="true"
      />
    </section>
  )
}
