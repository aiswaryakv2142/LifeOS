
import { Activity, CheckCircle2 } from 'lucide-react'
import { useLifeOS } from '../context/LifeOSContext'

export default function Habits() {
  const { habits, toggleHabit } = useLifeOS()
  const completed = habits.filter((habit) => habit.checked).length
  const percentage = habits.length
    ? Math.round((completed / habits.length) * 100)
    : 0

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-violet-300">SMALL DAILY ACTIONS</p>
        <h1 className="display-font mt-2 text-3xl font-semibold">My Habits</h1>
        <p className="mt-2 text-sm text-slate-400">
          Build consistency through small actions.
        </p>
      </header>

      <section className="panel rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Activity className="text-violet-300" size={25} />
          <div>
            <p className="text-sm text-slate-400">Today's check-in</p>
            <p className="mt-1 text-2xl font-semibold">
              {completed} of {habits.length} habits
            </p>
          </div>
          <span className="ml-auto text-lg font-semibold text-emerald-300">
            {percentage}%
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-300 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </section>

      <section className="panel rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Daily habits</h2>
        <ul className="mt-4 space-y-3">
          {habits.map((habit) => (
            <li key={habit.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.07] p-4 transition hover:border-violet-300/20 hover:bg-white/[0.025]">
                <input
                  type="checkbox"
                  checked={habit.checked}
                  onChange={() => toggleHabit(habit.id)}
                  className="h-4 w-4 accent-violet-400"
                />
                <span className={habit.checked ? 'flex-1 text-sm text-slate-500 line-through' : 'flex-1 text-sm text-slate-200'}>
                  {habit.name}
                </span>
                {habit.checked && <CheckCircle2 className="text-emerald-300" size={19} />}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-slate-500">
        Your check-ins are saved in this browser. Daily history and streaks are future upgrades.
      </p>
    </div>
  )
}
