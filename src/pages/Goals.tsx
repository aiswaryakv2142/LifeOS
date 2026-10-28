
import { useState, type FormEvent } from 'react'
import { Plus, Target, Trash2, TrendingUp, Sparkles } from 'lucide-react'
import { useLifeOS } from '../context/LifeOSContext'

export default function Goals() {
  const { goals, addGoal, updateGoalProgress, deleteGoal } = useLifeOS()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Personal')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()) return

    addGoal(title, category)
    setTitle('')
    setCategory('Personal')
  }

  function handleDelete(id: number, goalTitle: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${goalTitle}"?`,
    )

    if (confirmed) {
      deleteGoal(id)
    }
  }

  const averageProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((total, goal) => total + goal.progress, 0) /
            goals.length,
        )
      : 0

  const completedGoals = goals.filter(
    (goal) => goal.progress === 100,
  ).length

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-violet-300">
            <Target size={16} />
            <span>Personal development</span>
          </div>

          <h1 className="display-font text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your Goals
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Turn your ambitions into progress. Small steps count.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200 sm:self-auto">
          <Sparkles size={16} />
          <span>Keep moving forward</span>
        </div>
      </header>

      {/* Goal statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="panel rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total goals</p>
            <Target size={19} className="text-violet-300" />
          </div>

          <p className="mt-4 text-3xl font-semibold text-white">
            {goals.length}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Things you're working toward
          </p>
        </div>

        <div className="panel rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Average progress</p>
            <TrendingUp size={19} className="text-teal-300" />
          </div>

          <p className="mt-4 text-3xl font-semibold text-white">
            {averageProgress}%
          </p>

          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Average goal progress"
            aria-valuenow={averageProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-300 transition-all duration-500"
              style={{ width: `${averageProgress}%` }}
            />
          </div>
        </div>

        <div className="panel rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Goals completed</p>
            <span className="text-lg text-teal-300">✓</span>
          </div>

          <p className="mt-4 text-3xl font-semibold text-white">
            {completedGoals}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Goals that reached 100%
          </p>
        </div>
      </section>

      {/* Add a new goal */}
      <section className="panel rounded-2xl p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <Plus size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-white">Create a new goal</h2>
            <p className="mt-1 text-sm text-slate-400">
              Decide what you want to achieve next.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_auto]"
        >
          <div>
            <label
              htmlFor="goal-title"
              className="mb-2 block text-sm text-slate-300"
            >
              Goal name
            </label>

            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Get my dream internship"
              maxLength={120}
              required
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
            />
          </div>

          <div>
            <label
              htmlFor="goal-category"
              className="mb-2 block text-sm text-slate-300"
            >
              Category
            </label>

            <select
              id="goal-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#171522] px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
            >
              <option value="Personal">Personal</option>
              <option value="Career">Career</option>
              <option value="Learning">Learning</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
              <option value="Fitness">Fitness</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300 md:w-auto"
            >
              <Plus size={17} />
              Add goal
            </button>
          </div>
        </form>
      </section>

      {/* Goal list */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Your goal board
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Update your progress as you go.
            </p>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
          </span>
        </div>

        {goals.length === 0 ? (
          <div className="panel flex flex-col items-center rounded-2xl px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
              <Target size={26} />
            </div>

            <h3 className="font-semibold text-white">
              Your next chapter starts here
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              You don't have any goals yet. Add one above and start turning
              your plans into progress.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {goals.map((goal) => (
              <article
                key={goal.id}
                className="panel rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                      <Target size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-white">
                        {goal.title}
                      </h3>

                      <span className="mt-2 inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-xs text-violet-200">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(goal.id, goal.title)}
                    aria-label={`Delete goal: ${goal.title}`}
                    title={`Delete ${goal.title}`}
                    className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-400">Progress</p>

                  <p className="text-lg font-semibold tabular-nums text-white">
                    {goal.progress}%
                  </p>
                </div>

                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label={`Progress for ${goal.title}`}
                  aria-valuenow={goal.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-400 to-teal-300 transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor={`progress-${goal.id}`}
                    className="mb-3 flex items-center justify-between text-xs text-slate-400"
                  >
                    <span>Adjust progress</span>
                    <span>0% to 100%</span>
                  </label>

                  <input
                    id={`progress-${goal.id}`}
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={goal.progress}
                    onChange={(event) =>
                      updateGoalProgress(
                        goal.id,
                        Number(event.target.value),
                      )
                    }
                    className="w-full accent-violet-400"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {goal.progress === 100
                      ? 'Amazing! Goal completed'
                      : goal.progress === 0
                        ? 'Ready when you are'
                        : 'Every small step counts'}
                  </span>

                  {goal.progress === 100 && (
                    <span className="font-medium text-teal-300">
                      Completed ✓
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
