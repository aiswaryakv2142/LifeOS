
import { useEffect, useState } from 'react'
import { Clock3, Pause, Play, RotateCcw, Sparkles, Target } from 'lucide-react'

const modes = {
  Focus: 25 * 60,
  'Short break': 5 * 60,
  'Long break': 15 * 60,
}

type Mode = keyof typeof modes

export default function FocusMode() {
  const [mode, setMode] = useState<Mode>('Focus')
  const [seconds, setSeconds] = useState(modes.Focus)
  const [running, setRunning] = useState(false)
  const [intention, setIntention] = useState('')
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    if (!running) return

    const timer = window.setInterval(() => {
      setSeconds((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timer)
          setRunning(false)
          if (mode === 'Focus') {
            setSessions((count) => count + 1)
          }
          return 0
        }
        return remaining - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running, mode])

  function chooseMode(nextMode: Mode) {
    setMode(nextMode)
    setSeconds(modes[nextMode])
    setRunning(false)
  }

  function resetTimer() {
    setRunning(false)
    setSeconds(modes[mode])
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const progress = ((modes[mode] - seconds) / modes[mode]) * 100

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-[#8b78c6]">
          <Target size={18} />
          <span>One thing at a time</span>
        </div>
        <h1 className="display-font text-3xl font-bold text-[#342c4b]">
          Focus Mode
        </h1>
        <p className="mt-2 text-sm text-[#898197]">
          Give one task your attention, then give yourself a break.
        </p>
      </div>

      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-[#e9e2f1] bg-white/80 p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eee7fa] text-[#8b78c6]">
          <Sparkles size={23} />
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {(Object.keys(modes) as Mode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => chooseMode(item)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                mode === item
                  ? 'border-[#cfc1ed] bg-[#eee7fa] text-[#6954a3]'
                  : 'border-[#e9e2f1] text-[#817b91] hover:bg-[#faf7fd]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div
          className="mx-auto mt-8 flex h-56 w-56 items-center justify-center rounded-full border-[8px] border-[#eee7fa] sm:h-64 sm:w-64"
          style={{
            background: `conic-gradient(#9b86d5 ${progress}%, #f5f0fa ${progress}%)`,
          }}
        >
          <div className="flex h-48 w-48 flex-col items-center justify-center rounded-full bg-[#fffdfa] sm:h-56 sm:w-56">
            <Clock3 size={20} className="text-[#9b86d5]" />
            <p className="mt-2 font-mono text-4xl font-semibold tracking-tight text-[#45395d] sm:text-5xl">
              {String(minutes).padStart(2, '0')}:
              {String(remainingSeconds).padStart(2, '0')}
            </p>
            <p className="mt-2 text-sm text-[#898197]">{mode}</p>
          </div>
        </div>

        <div className="mt-7 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            disabled={seconds === 0}
            className="flex items-center gap-2 rounded-xl bg-[#8b78c6] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#7863b5] disabled:opacity-50"
          >
            {running ? <Pause size={17} /> : <Play size={17} />}
            {running ? 'Pause' : 'Start focus'}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="flex items-center gap-2 rounded-xl border border-[#e9e2f1] bg-white px-4 py-3 text-sm text-[#695d7d] hover:bg-[#faf7fd]"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {seconds === 0 && (
          <p role="status" className="mt-4 text-sm font-medium text-[#66816e]">
            Session complete! Take a breath before your next step.
          </p>
        )}

        <div className="mt-8 text-left">
          <label className="flex items-center gap-2 text-sm font-medium text-[#514568]">
            <Target size={16} className="text-[#8b78c6]" />
            My intention for this session
          </label>
          <input
            value={intention}
            onChange={(event) => setIntention(event.target.value)}
            placeholder="What would you like to focus on?"
            className="mt-2 w-full rounded-xl border border-[#e9e2f1] bg-[#fffdfa] p-3 text-sm outline-none focus:border-[#a493d2]"
          />
        </div>

        <p className="mt-6 text-sm text-[#898197]">
          Focus sessions completed: <strong className="text-[#6954a3]">{sessions}</strong>
        </p>
      </section>
    </div>
  )
}
