
import { useMemo, useState, type FormEvent } from 'react'
import {
  CalendarDays,
  Circle,
  Clock3,
  Filter,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  CheckCircle2,
  ListTodo,
} from 'lucide-react'
import {
  useLifeOS,
  type Task,
  type TaskCategory,
  type TaskPriority,
} from '../context/LifeOSContext'

type TaskFilter =
  | 'All'
  | 'Active'
  | 'Today'
  | 'Upcoming'
  | 'Overdue'
  | 'Completed'

const categories: TaskCategory[] = [
  'Career',
  'Study',
  'Personal',
  'Health',
  'Other',
]

const filters: TaskFilter[] = [
  'All',
  'Today',
  'Upcoming',
  'Overdue',
  'Active',
  'Completed',
]

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDueDate(dateString?: string) {
  if (!dateString) return 'No due date'

  const date = new Date(`${dateString}T12:00:00`)
  if (Number.isNaN(date.getTime())) return 'Invalid date'

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getDueLabel(task: Task) {
  if (!task.dueDate) return 'No due date'

  const today = getLocalDateString()

  if (task.done) return `Due ${formatDueDate(task.dueDate)}`
  if (task.dueDate < today) return `Overdue · ${formatDueDate(task.dueDate)}`
  if (task.dueDate === today) return 'Due today'

  return `Due ${formatDueDate(task.dueDate)}`
}

function priorityClasses(priority: TaskPriority) {
  if (priority === 'High') {
    return 'bg-rose-400/10 text-rose-300'
  }

  if (priority === 'Medium') {
    return 'bg-amber-400/10 text-amber-300'
  }

  return 'bg-emerald-400/10 text-emerald-300'
}

export default function Tasks() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask } = useLifeOS()

  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('Medium')
  const [category, setCategory] = useState<TaskCategory>('Study')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState<TaskFilter>('All')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [sortBy, setSortBy] = useState('Due date')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPriority, setEditPriority] = useState<TaskPriority>('Medium')
  const [editCategory, setEditCategory] = useState<TaskCategory>('Other')
  const [editDueDate, setEditDueDate] = useState('')

  const today = getLocalDateString()

  const counts = useMemo(() => {
    const activeTasks = tasks.filter((task) => !task.done)
    return {
      total: tasks.length,
      active: activeTasks.length,
      completed: tasks.filter((task) => task.done).length,
      overdue: activeTasks.filter(
        (task) => Boolean(task.dueDate) && task.dueDate! < today,
      ).length,
      dueToday: activeTasks.filter((task) => task.dueDate === today).length,
    }
  }, [tasks, today])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return

    addTask(title.trim(), priority, {
      category,
      ...(dueDate ? { dueDate } : {}),
    })

    setTitle('')
    setPriority('Medium')
    setCategory('Study')
    setDueDate('')
  }

  function matchesFilter(task: Task) {
    switch (filter) {
      case 'Active':
        return !task.done
      case 'Today':
        return !task.done && task.dueDate === today
      case 'Upcoming':
        return (
          !task.done &&
          Boolean(task.dueDate) &&
          task.dueDate! > today
        )
      case 'Overdue':
        return (
          !task.done &&
          Boolean(task.dueDate) &&
          task.dueDate! < today
        )
      case 'Completed':
        return task.done
      default:
        return true
    }
  }

  const visibleTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.trim().toLowerCase())

      const matchesCategory =
        categoryFilter === 'All categories' ||
        (task.category ?? 'Other') === categoryFilter

      return matchesFilter(task) && matchesSearch && matchesCategory
    })

    return result.sort((a, b) => {
      if (sortBy === 'Priority') {
        const rank: Record<TaskPriority, number> = {
          High: 0,
          Medium: 1,
          Low: 2,
        }
        return rank[a.priority] - rank[b.priority]
      }

      if (sortBy === 'Alphabetical') {
        return a.title.localeCompare(b.title)
      }

      if (sortBy === 'Newest') {
        return b.id - a.id
      }

      // Tasks with dates first, then earliest date first.
      if (a.dueDate && b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate)
      }
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return b.id - a.id
    })
  }, [tasks, filter, search, categoryFilter, sortBy, today])

  function startEditing(task: Task) {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditPriority(task.priority)
    setEditCategory(task.category ?? 'Other')
    setEditDueDate(task.dueDate ?? '')
  }

  function saveEditing(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault()
    if (!editTitle.trim()) return

    updateTask(id, {
      title: editTitle.trim(),
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate,
    })

    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm tracking-[0.18em] text-violet-300">
          STAY ORGANIZED
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="display-font text-3xl font-semibold sm:text-4xl">
              My Tasks
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              A little progress, one task at a time.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Sparkles size={16} className="text-violet-300" />
            {counts.active} left to complete
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<ListTodo size={18} />}
          label="Total tasks"
          value={counts.total}
          detail="Everything on your list"
          tint="violet"
        />
        <StatCard
          icon={<Clock3 size={18} />}
          label="In progress"
          value={counts.active}
          detail="Still to be done"
          tint="blue"
        />
        <StatCard
          icon={<CalendarDays size={18} />}
          label="Due today"
          value={counts.dueToday}
          detail="Keep these in view"
          tint="amber"
        />
        <StatCard
          icon={<CheckCircle2 size={18} />}
          label="Overdue"
          value={counts.overdue}
          detail="Ready for a fresh plan"
          tint="rose"
        />
      </section>

      <form
        onSubmit={handleSubmit}
        className="panel space-y-4 rounded-2xl p-5 sm:p-6"
      >
        <div>
          <p className="text-xs font-medium tracking-wider text-violet-300">
            NEW TASK
          </p>
          <h2 className="mt-1 text-lg font-semibold">
            What would you like to get done?
          </h2>
        </div>

        <label htmlFor="task-title" className="sr-only">
          Task title
        </label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Finish my assignment"
          maxLength={180}
          required
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300/50"
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Priority">
            <select
              aria-label="Task priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as TaskPriority)
              }
              className="field-control"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </Field>

          <Field label="Category">
            <select
              aria-label="Task category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TaskCategory)
              }
              className="field-control"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>

          <Field label="Due date">
            <input
              aria-label="Task due date"
              type="date"
              min="2000-01-01"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="field-control"
            />
          </Field>

          <div className="flex items-end">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <Plus size={17} />
              Add task
            </button>
          </div>
        </div>
      </form>

      <section className="panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Your task list</h2>
              <p className="mt-1 text-xs text-slate-400">
                Showing {visibleTasks.length} of {tasks.length} tasks
              </p>
            </div>

            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3">
              <Search size={16} className="text-slate-500" />
              <input
                aria-label="Search tasks"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
                className="min-w-0 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-slate-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="text-slate-400 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </label>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Task filters">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                aria-pressed={filter === item}
                className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                  filter === item
                    ? 'bg-violet-500 text-white shadow-sm'
                    : 'border border-white/10 bg-white/[0.025] text-slate-400 hover:border-violet-300/30 hover:text-slate-200'
                }`}
              >
                {item}
                {item === 'Overdue' && counts.overdue > 0
                  ? ` (${counts.overdue})`
                  : ''}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Category">
              <select
                aria-label="Filter by category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="field-control"
              >
                <option>All categories</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>

            <Field label="Sort by">
              <select
                aria-label="Sort tasks"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="field-control"
              >
                <option>Due date</option>
                <option>Priority</option>
                <option>Newest</option>
                <option>Alphabetical</option>
              </select>
            </Field>
          </div>
        </div>

        <ul className="mt-5 space-y-3">
          {visibleTasks.map((task) => {
            const overdue =
              !task.done && Boolean(task.dueDate) && task.dueDate! < today

            return (
              <li
                key={task.id}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-violet-300/20 hover:bg-white/[0.035]"
              >
                {editingId === task.id ? (
                  <form
                    onSubmit={(event) => saveEditing(event, task.id)}
                    className="space-y-3"
                  >
                    <label className="block text-xs text-slate-400">
                      Task title
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        maxLength={180}
                        required
                        className="field-control mt-1"
                      />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Priority">
                        <select
                          value={editPriority}
                          onChange={(event) =>
                            setEditPriority(event.target.value as TaskPriority)
                          }
                          className="field-control"
                        >
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      </Field>

                      <Field label="Category">
                        <select
                          value={editCategory}
                          onChange={(event) =>
                            setEditCategory(event.target.value as TaskCategory)
                          }
                          className="field-control"
                        >
                          {categories.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Due date">
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(event) =>
                            setEditDueDate(event.target.value)
                          }
                          className="field-control"
                        />
                      </Field>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-violet-500 px-3 py-2 text-xs font-medium text-white hover:bg-violet-400"
                      >
                        Save changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start gap-3">
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
                          size={21}
                          className="text-emerald-300"
                        />
                      ) : (
                        <Circle size={21} className="text-slate-500" />
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

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] ${priorityClasses(task.priority)}`}
                        >
                          {task.priority} priority
                        </span>

                        <span className="rounded-full bg-violet-300/10 px-2 py-1 text-[10px] text-violet-200">
                          {task.category ?? 'Other'}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 text-[11px] ${
                            overdue
                              ? 'text-rose-300'
                              : task.dueDate === today && !task.done
                                ? 'text-amber-300'
                                : 'text-slate-400'
                          }`}
                        >
                          <CalendarDays size={12} />
                          {getDueLabel(task)}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEditing(task)}
                        aria-label={`Edit ${task.title}`}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-400/10 hover:text-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete ${task.title}`}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {visibleTasks.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-300/10">
              {search || filter !== 'All' || categoryFilter !== 'All categories' ? (
                <Filter size={22} className="text-violet-300" />
              ) : (
                <Circle size={22} className="text-violet-300" />
              )}
            </div>
            <p className="mt-3 text-sm font-medium text-slate-300">
              {filter === 'Completed'
                ? 'No completed tasks here yet'
                : filter === 'Today'
                  ? 'Nothing due today'
                  : filter === 'Overdue'
                    ? 'You’re all caught up'
                    : 'Nothing found'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try another filter, or add a task to get started.
            </p>
            {(search || filter !== 'All' || categoryFilter !== 'All categories') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setFilter('All')
                  setCategoryFilter('All categories')
                }}
                className="mt-4 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block min-w-0 text-xs text-slate-400">
      {label}
      {children}
    </label>
  )
}

function StatCard({
  icon,
  label,
  value,
  detail,
  tint,
}: {
  icon: React.ReactNode
  label: string
  value: number
  detail: string
  tint: 'violet' | 'blue' | 'amber' | 'rose'
}) {
  const tintClasses = {
    violet: 'bg-violet-300/10 text-violet-200',
    blue: 'bg-sky-300/10 text-sky-200',
    amber: 'bg-amber-300/10 text-amber-200',
    rose: 'bg-rose-300/10 text-rose-200',
  }

  return (
    <div className="panel rounded-2xl p-4 sm:p-5">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${tintClasses[tint]}`}
      >
        {icon}
      </div>
      <p className="mt-4 text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-100">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{detail}</p>
    </div>
  )
}
