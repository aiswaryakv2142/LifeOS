
import { useEffect, useState } from 'react'
import { BookHeart, CalendarDays, Sparkles } from 'lucide-react'

type JournalEntry = {
  date: string
  mood: string
  highlight: string
  reflection: string
}

const STORAGE_KEY = 'lifeos-journal-v1'

export default function Journal() {
  const today = new Date().toISOString().slice(0, 10)

  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [date, setDate] = useState(today)
  const [mood, setMood] = useState('Good')
  const [highlight, setHighlight] = useState('')
  const [reflection, setReflection] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setEntries(JSON.parse(saved) as JournalEntry[])
    } catch {
      setMessage('Could not load saved entries.')
    }
  }, [])

  function saveEntry() {
    const entry: JournalEntry = { date, mood, highlight, reflection }
    const updated = [
      entry,
      ...entries.filter((item) => item.date !== date),
    ].sort((a, b) => b.date.localeCompare(a.date))

    setEntries(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setMessage('Your entry has been saved 💜')
    } catch {
      setMessage('Could not save your entry. Please check browser storage.')
    }
  }

  function loadEntry(entry: JournalEntry) {
    setDate(entry.date)
    setMood(entry.mood)
    setHighlight(entry.highlight)
    setReflection(entry.reflection)
    setMessage('')
  }

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-[#8b78c6]">
          <BookHeart size={18} />
          <span>Your personal space</span>
        </div>
        <h1 className="display-font text-3xl font-bold text-[#342c4b]">
          My Journal
        </h1>
        <p className="mt-2 text-sm text-[#898197]">
          A quiet moment to check in with yourself. No perfect days required.
        </p>
      </div>

      <section className="rounded-2xl border border-[#e9e2f1] bg-white/80 p-5 shadow-sm sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#45395d]">
          <Sparkles size={19} className="text-[#8b78c6]" />
          Today's reflection
        </h2>

        <label className="mt-6 block text-sm font-medium text-[#514568]">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[#e9e2f1] bg-white p-3 text-sm outline-none focus:border-[#a493d2] sm:max-w-xs"
        />

        <label className="mt-5 block text-sm font-medium text-[#514568]">
          How are you feeling?
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Amazing', 'Good', 'Okay', 'Low', 'Stressed'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMood(option)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                mood === option
                  ? 'border-[#cfc1ed] bg-[#eee7fa] text-[#6954a3]'
                  : 'border-[#e9e2f1] bg-white text-[#817b91] hover:bg-[#faf7fd]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <label className="mt-6 block text-sm font-medium text-[#514568]">
          One good thing about today
        </label>
        <textarea
          value={highlight}
          onChange={(event) => setHighlight(event.target.value)}
          placeholder="A small win, a happy moment, something you're grateful for..."
          rows={3}
          className="mt-2 w-full rounded-xl border border-[#e9e2f1] bg-[#fffdfa] p-3 text-sm outline-none focus:border-[#a493d2]"
        />

        <label className="mt-5 block text-sm font-medium text-[#514568]">
          What's on your mind?
        </label>
        <textarea
          value={reflection}
          onChange={(event) => setReflection(event.target.value)}
          placeholder="Write freely. You don't need to have everything figured out."
          rows={5}
          className="mt-2 w-full rounded-xl border border-[#e9e2f1] bg-[#fffdfa] p-3 text-sm outline-none focus:border-[#a493d2]"
        />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={saveEntry}
            className="rounded-xl bg-[#8b78c6] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7863b5]"
          >
            Save journal entry
          </button>
          {message && (
            <p role="status" className="text-sm text-[#66816e]">
              {message}
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[#e9e2f1] bg-white/70 p-5 sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#45395d]">
          <CalendarDays size={19} className="text-[#8b78c6]" />
          Previous entries
        </h2>

        {entries.length === 0 ? (
          <p className="mt-4 text-sm text-[#898197]">
            Your saved reflections will appear here.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {entries.map((entry) => (
              <button
                key={entry.date}
                type="button"
                onClick={() => loadEntry(entry)}
                className="block w-full rounded-xl border border-[#eee7f3] bg-[#fffdfa] p-4 text-left transition hover:border-[#cfc1ed]"
              >
                <span className="text-xs text-[#898197]">{entry.date}</span>
                <p className="mt-1 text-sm font-semibold text-[#514568]">
                  {entry.mood}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-[#817b91]">
                  {entry.highlight || entry.reflection || 'A quiet check-in'}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
