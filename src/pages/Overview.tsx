
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLifeOS } from '../context/LifeOSContext'
import TimeScene from '../components/TimeScene'

export default function Overview() {
  const { tasks, goals, habits, toggleTask } = useLifeOS()

  const completedTasks = tasks.filter((task) => task.done).length
  const activeTasks = tasks.filter((task) => !task.done)
  const checkedHabits = habits.filter((habit) => habit.checked).length

  const goalProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum, goal) => sum + goal.progress, 0) /
            goals.length,
        )
      : 0

  const taskProgress =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-7">
      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#e7def2] bg-gradient-to-br from-[#f0e9fb] via-[#fcf6f0] to-[#eaf3e9] p-6 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-white/45 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#dcebdc]/50 blur-2xl" />

        <div className="relative grid items-center gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-xs font-medium text-[#7866a5] shadow-sm">
              <Sparkles size={14} />
              A fresh page, a fresh start
            </div>

            <p className="text-sm font-medium text-[#81758e]">{greeting} ✨</p>

            <h1 className="display-font mt-2 max-w-xl text-3xl font-bold leading-tight text-[#352d4b] sm:text-4xl lg:text-[46px]">
              Make space for the life you want.
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#797287] sm:text-base">
              You don't need to have everything figured out. Choose what
              matters today, take one small step, and let the progress add up.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/tasks"
                className="inline-flex items-center gap-2 rounded-xl bg-[#8069b5] px-5 py-3 text-sm font-semibold text-[#ffffff] shadow-[0_8px_20px_rgba(128,105,181,0.22)] transition hover:-translate-y-0.5 hover:bg-[#725aa9]"
              >
                Focus on my tasks
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/goals"
                className="inline-flex items-center gap-2 rounded-xl border border-white/90 bg-white/75 px-5 py-3 text-sm font-medium text-[#665783] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Explore my goals
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-[#7d8f7f]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/75">
                <CheckCircle2 size={13} />
              </span>
              Progress, not perfection.
            </div>
          </div>

          {/* Custom sunrise illustration */}
          <div className="relative mx-auto w-full max-w-[420px]">
            <SunriseIllustration />
          </div>
        </div>
      </section>

      {/* Animated time-of-day scene */}
      <TimeScene />

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tasks completed"
          value={`${completedTasks}/${tasks.length}`}
          detail={
            tasks.length === 0
              ? 'Add your first task'
              : `${taskProgress}% of your task list`
          }
          icon={<CheckCircle2 size={20} />}
          theme="lavender"
        />

        <StatCard
          label="Active goals"
          value={goals.length}
          detail={`${goalProgress}% average progress`}
          icon={<Target size={20} />}
          theme="peach"
        />

        <StatCard
          label="Habits checked"
          value={`${checkedHabits}/${habits.length}`}
          detail={
            habits.length > 0 && checkedHabits === habits.length
              ? 'Every habit checked'
              : 'One small action at a time'
          }
          icon={<Activity size={20} />}
          theme="sage"
        />

        <StatCard
          label="Tasks remaining"
          value={activeTasks.length}
          detail={
            activeTasks.length === 0
              ? 'Nothing waiting right now'
              : 'Choose your next small step'
          }
          icon={<TrendingUp size={20} />}
          theme="blue"
        />
      </section>

      {/* Task and goal sections */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#38304d]">
                Today's little steps
              </h2>
              <p className="mt-1 text-sm text-[#92899f]">
                Keep things manageable.
              </p>
            </div>

            <Link
              to="/tasks"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#8069b5] hover:text-[#6652a5]"
            >
              All tasks <ArrowRight size={14} />
            </Link>
          </div>

          {tasks.length === 0 ? (
            <EmptyState
              title="Start with one small step"
              message="Add a task and give yourself something simple to focus on."
            />
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <button
                  type="button"
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#f0ebf4] bg-[#fffdfa] p-3.5 text-left transition hover:border-[#dcd0f0] hover:bg-[#fbf8ff]"
                  aria-pressed={task.done}
                >
                  {task.done ? (
                    <CheckCircle2
                      size={19}
                      className="shrink-0 text-[#86a58e]"
                    />
                  ) : (
                    <Circle
                      size={19}
                      className="shrink-0 text-[#b7a8d5]"
                    />
                  )}

                  <span
                    className={`min-w-0 flex-1 break-words text-sm ${
                      task.done
                        ? 'text-[#a19aab] line-through'
                        : 'text-[#4b435d]'
                    }`}
                  >
                    {task.title}
                  </span>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                      task.priority === 'High'
                        ? 'bg-[#fff0eb] text-[#b86f5d]'
                        : task.priority === 'Medium'
                          ? 'bg-[#f0eafb] text-[#8069b5]'
                          : 'bg-[#edf4ee] text-[#66866e]'
                    }`}
                  >
                    {task.priority}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="panel p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#38304d]">
                Growing towards
              </h2>
              <p className="mt-1 text-sm text-[#92899f]">
                Your ambitions, one step at a time.
              </p>
            </div>

            <Link
              to="/goals"
              aria-label="View all goals"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eafb] text-[#8069b5] transition hover:bg-[#e8def8]"
            >
              <ArrowRight size={17} />
            </Link>
          </div>

          {goals.length === 0 ? (
            <EmptyState
              title="Dream a little bigger"
              message="Add a personal goal and track your progress here."
            />
          ) : (
            <div className="space-y-5">
              {goals.slice(0, 4).map((goal, index) => (
                <div key={goal.id}>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-[#4b435d]">
                        {goal.title}
                      </p>
                      <p className="mt-1 text-xs text-[#9b93a8]">
                        {goal.category}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-[#7662a9]">
                      {goal.progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#f0edf5]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${goal.progress}%`,
                        background:
                          index % 3 === 0
                            ? 'linear-gradient(90deg, #b7a2e8, #8975c4)'
                            : index % 3 === 1
                              ? 'linear-gradient(90deg, #bed8c0, #82a78c)'
                              : 'linear-gradient(90deg, #f0c9b4, #e6a789)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-[#e8e0f3] bg-gradient-to-r from-[#f5effc] to-[#f2f6ee] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-[#8b78c6]">
                <Sparkles size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#55466e]">
                  A note to yourself
                </p>
                <p className="mt-1 text-xs leading-5 text-[#887d96]">
                  You are allowed to grow slowly. Consistency doesn't have to
                  look perfect to be meaningful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  detail,
  icon,
  theme,
}: {
  label: string
  value: string | number
  detail: string
  icon: React.ReactNode
  theme: 'lavender' | 'peach' | 'sage' | 'blue'
}) {
  const styles = {
    lavender: 'bg-[#f0eafb] text-[#8771bb]',
    peach: 'bg-[#fff0e8] text-[#c4876d]',
    sage: 'bg-[#edf4ee] text-[#76947c]',
    blue: 'bg-[#edf2fc] text-[#718bbf]',
  }

  return (
    <article className="panel interactive-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#8c8499]">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#38304d]">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles[theme]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-[#9a92a6]">{detail}</p>
    </article>
  )
}

function EmptyState({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#e8e0f0] bg-[#fcfaff] px-5 py-8 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0eafb] text-[#8b78c6]">
        <Sparkles size={20} />
      </div>
      <h3 className="text-sm font-semibold text-[#55496c]">{title}</h3>
      <p className="mt-2 max-w-xs text-xs leading-5 text-[#968da3]">
        {message}
      </p>
    </div>
  )
}

function SunriseIllustration() {
  return (
    <div className="illustration-surface illustration-grid aspect-[1.15/1] w-full">
      <div className="illustration-orb right-8 top-5 h-28 w-28 bg-[#fff5dc] shadow-[0_0_45px_rgba(243,209,139,0.35)]" />

      <svg
        viewBox="0 0 420 340"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Illustration of a peaceful sunrise over soft lavender and sage hills"
      >
        <defs>
          <linearGradient id="sunrise-sky" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#f6eefa" />
            <stop offset="100%" stopColor="#f8f0e4" />
          </linearGradient>
          <linearGradient id="sunrise-hill-one" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d8c9ef" />
            <stop offset="100%" stopColor="#c4b6e4" />
          </linearGradient>
          <linearGradient id="sunrise-hill-two" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c4ddc7" />
            <stop offset="100%" stopColor="#a7c6ad" />
          </linearGradient>
        </defs>

        <rect width="420" height="340" rx="24" fill="url(#sunrise-sky)" />

        <circle cx="300" cy="112" r="53" fill="#f0ce94" opacity="0.3" />
        <circle cx="300" cy="112" r="38" fill="#f3d69d" />

        <g fill="#ffffff" opacity="0.82">
          <ellipse cx="99" cy="88" rx="35" ry="12" />
          <ellipse cx="121" cy="81" rx="22" ry="18" />
          <ellipse cx="143" cy="89" rx="26" ry="11" />

          <ellipse cx="265" cy="176" rx="26" ry="9" />
          <ellipse cx="283" cy="170" rx="17" ry="14" />
          <ellipse cx="301" cy="176" rx="21" ry="9" />
        </g>

        <path
          d="M0 224 C56 168 101 195 153 214 C202 232 245 187 296 195 C343 203 377 227 420 194 L420 340 L0 340Z"
          fill="url(#sunrise-hill-one)"
        />

        <path
          d="M0 257 C67 221 115 240 171 259 C237 282 286 225 337 241 C374 252 397 266 420 255 L420 340 L0 340Z"
          fill="url(#sunrise-hill-two)"
        />

        <path
          d="M0 292 C65 268 118 285 170 297 C230 311 295 274 351 287 C381 293 402 302 420 295 L420 340 L0 340Z"
          fill="#e4efe2"
        />

        <g stroke="#8eaa92" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8">
          <path d="M62 279 C63 260 59 247 50 235" />
          <path d="M62 267 C73 259 79 249 79 239" />
          <path d="M62 257 C52 252 46 245 44 236" />
          <path d="M353 280 C354 260 361 246 371 237" />
          <path d="M358 264 C346 258 341 249 341 240" />
        </g>

        <g fill="#f7f1ff" opacity="0.9">
          <circle cx="71" cy="215" r="3" />
          <circle cx="90" cy="232" r="2" />
          <circle cx="328" cy="219" r="3" />
          <circle cx="347" cy="202" r="2" />
          <circle cx="213" cy="182" r="2" />
        </g>

        <g transform="translate(22 24)">
          <rect
            width="135"
            height="45"
            rx="13"
            fill="#ffffff"
            fillOpacity="0.82"
            stroke="#ffffff"
            strokeOpacity="0.8"
          />
          <circle cx="19" cy="22" r="5" fill="#8ca995" />
          <text
            x="32"
            y="19"
            fontSize="9"
            fontWeight="600"
            fill="#6d657c"
          >
            A NEW DAY
          </text>
          <text x="32" y="31" fontSize="8" fill="#92879e">
            Start where you are
          </text>
        </g>

        <g transform="translate(236 270)">
          <rect
            width="156"
            height="51"
            rx="14"
            fill="#ffffff"
            fillOpacity="0.9"
            stroke="#ffffff"
          />
          <circle cx="20" cy="25" r="11" fill="#eee6fa" />
          <path
            d="M15 25 L19 29 L26 20"
            stroke="#8b78c6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <text
            x="39"
            y="22"
            fontSize="9"
            fontWeight="600"
            fill="#625574"
          >
            SMALL STEPS
          </text>
          <text x="39" y="34" fontSize="8" fill="#9b90a6">
            Still moving forward
          </text>
        </g>
      </svg>
    </div>
  )
}
