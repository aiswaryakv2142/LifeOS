
import { useMemo, useState, type FormEvent } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Circle,
  CheckCircle2,
  Plus,
  Clock,
  Sparkles,
  ListTodo,
  X,
} from 'lucide-react'
import { useLifeOS, type Task } from '../context/LifeOSContext'

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(dateKey: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(`${dateKey}T12:00:00`)
  return date.toLocaleDateString(
    'en-IN',
    options ?? {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  )
}

function priorityColor(priority: Task['priority']) {
  if (priority === 'High') return 'bg-rose-400'
  if (priority === 'Medium') return 'bg-amber-300'
  return 'bg-emerald-300'
}

function priorityTextColor(priority: Task['priority']) {
  if (priority === 'High') return 'text-rose-300'
  if (priority === 'Medium') return 'text-amber-300'
  return 'text-emerald-300'
}

export default function Calendar() {
  const { tasks, addTask, toggleTask } = useLifeOS()

  const [todayKey] = useState(() => toDateKey(new Date()))
  const [selectedDate, setSelectedDate] = useState(() =>
    toDateKey(new Date()),
  )
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] =
    useState<Task['priority']>('Medium')
  const [newTaskCategory, setNewTaskCategory] = useState('Personal')

  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()

  const monthLabel = visibleMonth.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const mondayOffset = (firstDay.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: Array<{ key: string; date: Date; inMonth: boolean }> = []

    for (let index = 0; index < mondayOffset; index++) {
      const date = new Date(year, month, index - mondayOffset + 1)
      cells.push({
        key: toDateKey(date),
        date,
        inMonth: false,
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      cells.push({
        key: toDateKey(date),
        date,
        inMonth: true,
      })
    }

    while (cells.length % 7 !== 0 || cells.length < 35) {
      const lastDate = cells[cells.length - 1].date
      const date = new Date(
        lastDate.getFullYear(),
        lastDate.getMonth(),
        lastDate.getDate() + 1,
      )

      cells.push({
        key: toDateKey(date),
        date,
        inMonth: date.getMonth() === month,
      })
    }

    return cells
  }, [year, month])

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {}

    tasks.forEach((task) => {
      if (!task.dueDate) return
      if (!grouped[task.dueDate]) grouped[task.dueDate] = []
      grouped[task.dueDate].push(task)
    })

    return grouped
  }, [tasks])

  const selectedTasks = tasksByDate[selectedDate] ?? []
  const completedCount = selectedTasks.filter((task) => task.done).length
  const pendingCount = selectedTasks.length - completedCount

  const datedTasks = tasks.filter((task) => Boolean(task.dueDate))
  const remainingDatedTasks = datedTasks.filter((task) => !task.done)
  const overdueTasks = remainingDatedTasks.filter(
    (task) => task.dueDate! < todayKey,
  )
  const todayTasks = remainingDatedTasks.filter(
    (task) => task.dueDate === todayKey,
  )

  function changeMonth(amount: number) {
    setVisibleMonth((current) =>
      new Date(current.getFullYear(), current.getMonth() + amount, 1),
    )
  }

  function goToToday() {
    const now = new Date()
    setSelectedDate(toDateKey(now))
    setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1))
  }

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!newTaskTitle.trim()) return

    addTask(newTaskTitle.trim(), newTaskPriority, {
      dueDate: selectedDate,
      category: newTaskCategory as
        | 'Career'
        | 'Study'
        | 'Personal'
        | 'Health'
        | 'Other',
    })

    setNewTaskTitle('')
    setNewTaskPriority('Medium')
    setNewTaskCategory('Personal')
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm tracking-[0.18em] text-violet-300">
          PLAN AHEAD
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="display-font text-3xl font-semibold sm:text-4xl">
              My Calendar
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Make room for the things that matter.
            </p>
          </div>

          <button
            type="button"
            onClick={goToToday}
            className="flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-200 transition hover:border-violet-300/30 hover:bg-violet-300/10 sm:self-auto"
          >
            <CalendarDays size={16} />
            Today
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={<CalendarDays size={18} />}
          label="Scheduled tasks"
          value={datedTasks.length}
          detail="Tasks with due dates"
          color="violet"
        />
        <SummaryCard
          icon={<Clock size={18} />}
          label="Due today"
          value={todayTasks.length}
          detail="Still to be completed"
          color="amber"
        />
        <SummaryCard
          icon={<ListTodo size={18} />}
          label="Overdue"
          value={overdueTasks.length}
          detail="Past their due date"
          color="rose"
        />
        <SummaryCard
          icon={<CheckCircle2 size={18} />}
          label="Completed"
          value={datedTasks.filter((task) => task.done).length}
          detail="Dated tasks finished"
          color="green"
        />
      </section>

      <section className="panel overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs tracking-wider text-violet-300">
              YOUR SCHEDULE
            </p>
            <h2 className="mt-1 text-xl font-semibold">{monthLabel}</h2>
            <p className="mt-1 text-xs text-slate-500">
              Select a date to explore your agenda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
              className="rounded-xl border border-white/10 p-2.5 text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
              className="rounded-xl border border-white/10 p-2.5 text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-5">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
              (day) => (
                <div
                  key={day}
                  className="py-2 text-center text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs"
                >
                  {day}
                </div>
              ),
            )}

            {calendarDays.map(({ key, date, inMonth }) => {
              const isToday = key === todayKey
              const isSelected = key === selectedDate
              const dayTasks = tasksByDate[key] ?? []
              const unfinished = dayTasks.filter((task) => !task.done).length
              const allDone =
                dayTasks.length > 0 && unfinished === 0

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(key)}
                  aria-label={`${formatDate(key)}${dayTasks.length ? `, ${dayTasks.length} tasks` : ''}`}
                  aria-pressed={isSelected}
                  className={`relative flex min-h-[66px] flex-col items-center rounded-xl border p-1.5 transition focus:outline-none focus:ring-2 focus:ring-violet-300 sm:min-h-[90px] sm:p-2 ${
                    isSelected
                      ? 'border-violet-300/60 bg-violet-400/15'
                      : 'border-transparent hover:border-white/10 hover:bg-white/[0.04]'
                  } ${!inMonth ? 'opacity-35' : ''}`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs sm:h-8 sm:w-8 sm:text-sm ${
                      isToday
                        ? 'bg-violet-400 font-semibold text-white'
                        : isSelected
                          ? 'font-semibold text-violet-200'
                          : 'text-slate-300'
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  {dayTasks.length > 0 && (
                    <div className="mt-1.5 flex min-h-2 items-center justify-center gap-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <span
                          key={task.id}
                          className={`h-1.5 w-1.5 rounded-full ${
                            task.done
                              ? 'bg-emerald-300'
                              : priorityColor(task.priority)
                          }`}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[9px] text-slate-400">
                          +{dayTasks.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {dayTasks.length > 0 && (
                    <span
                      className={`mt-1 hidden text-[9px] sm:block ${
                        allDone ? 'text-emerald-300' : 'text-slate-500'
                      }`}
                    >
                      {allDone
                        ? 'Done'
                        : `${unfinished} pending`}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.07] pt-4 text-[11px] text-slate-400">
            <Legend color="bg-violet-400" label="Today" />
            <Legend color="bg-rose-400" label="High priority" />
            <Legend color="bg-amber-300" label="Medium priority" />
            <Legend color="bg-emerald-300" label="Completed / low priority" />
          </div>
        </div>
      </section>

      <section className="panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs tracking-wider text-violet-300">
              DAILY AGENDA
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              {selectedDate === todayKey
                ? 'Today'
                : formatDate(selectedDate, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {selectedTasks.length === 0
                ? 'A little room to breathe.'
                : `${completedCount} completed · ${pendingCount} remaining`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm((current) => !current)}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400"
          >
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            {showAddForm ? 'Cancel' : 'Add task'}
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddTask}
            className="mt-5 space-y-3 rounded-xl border border-violet-300/15 bg-violet-300/[0.04] p-4"
          >
            <p className="text-xs text-slate-400">
              New task for {formatDate(selectedDate, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>

            <label className="block text-xs text-slate-400">
              Task title
              <input
                autoFocus
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="What do you want to get done?"
                maxLength={180}
                required
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#161523] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-300/50"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs text-slate-400">
                Priority
                <select
                  value={newTaskPriority}
                  onChange={(event) =>
                    setNewTaskPriority(
                      event.target.value as Task['priority'],
                    )
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161523] px-3 py-3 text-sm text-white outline-none focus:border-violet-300/50"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>

              <label className="block text-xs text-slate-400">
                Category
                <select
                  value={newTaskCategory}
                  onChange={(event) => setNewTaskCategory(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161523] px-3 py-3 text-sm text-white outline-none focus:border-violet-300/50"
                >
                  <option>Career</option>
                  <option>Study</option>
                  <option>Personal</option>
                  <option>Health</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400"
            >
              <Plus size={16} />
              Save task to calendar
            </button>
          </form>
        )}

        {selectedTasks.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {selectedTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={
                    task.done ? 'Mark task incomplete' : 'Complete task'
                  }
                  aria-pressed={task.done}
                  className="mt-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                  {task.done ? (
                    <CheckCircle2
                      size={20}
                      className="text-emerald-300"
                    />
                  ) : (
                    <Circle size={20} className="text-slate-500" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`break-words text-sm ${
                      task.done
                        ? 'text-slate-500 line-through'
                        : 'text-slate-200'
                    }`}
                  >
                    {task.title}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                    <span
                      className={`rounded-full bg-white/[0.04] px-2 py-1 ${priorityTextColor(task.priority)}`}
                    >
                      {task.priority} priority
                    </span>
                    <span className="rounded-full bg-violet-300/10 px-2 py-1 text-violet-200">
                      {task.category ?? 'Other'}
                    </span>
                    {task.done && (
                      <span className="text-emerald-300">Completed</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-300/10">
              <CalendarDays size={22} className="text-violet-300" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-300">
              Nothing scheduled for this day
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Add a task here to give this day a little direction.
            </p>
          </div>
        )}
      </section>

      <section className="panel flex items-start gap-3 rounded-2xl p-5 sm:p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-300/10">
          <Sparkles size={19} className="text-violet-300" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">A gentle reminder</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Your calendar is a guide, not a deadline for your worth.
            Focus on the next small step, and give yourself room to adjust.
          </p>
        </div>
      </section>
    </div>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  detail: string
  color: 'violet' | 'amber' | 'rose' | 'green'
}) {
  const colors = {
    violet: 'bg-violet-300/10 text-violet-200',
    amber: 'bg-amber-300/10 text-amber-200',
    rose: 'bg-rose-300/10 text-rose-200',
    green: 'bg-emerald-300/10 text-emerald-200',
  }

  return (
    <div className="panel rounded-2xl p-4 sm:p-5">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="mt-4 text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-100">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{detail}</p>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  )
}
