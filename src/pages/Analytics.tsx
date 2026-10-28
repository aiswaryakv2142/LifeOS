
import {
  Activity,
  CheckCircle2,
  Target,
  ListTodo,
  Sparkles,
  CircleDashed,
} from 'lucide-react'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

import { useLifeOS } from '../context/LifeOSContext'

const COLORS = {
  violet: '#a78bfa',
  purple: '#8b5cf6',
  mint: '#5eead4',
  blue: '#7dd3fc',
  pink: '#f0abfc',
  muted: '#77758f',
  grid: 'rgba(190, 175, 255, 0.10)',
}

const tooltipStyle = {
  backgroundColor: '#191827',
  border: '1px solid rgba(190, 175, 255, 0.2)',
  borderRadius: '12px',
  color: '#f4f2ff',
  fontSize: '12px',
}

function StatCard({
  label,
  value,
  description,
  icon,
  accent,
}: {
  label: string
  value: string | number
  description: string
  icon: React.ReactNode
  accent: string
}) {
  return (
    <article className="panel interactive-card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            color: accent,
            backgroundColor: `${accent}18`,
          }}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </article>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="panel rounded-2xl p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>

      {children}
    </section>
  )
}

export default function Analytics() {
  const { tasks, goals, habits } = useLifeOS()

  const completedTasks = tasks.filter((task) => task.done).length
  const activeTasks = tasks.filter((task) => !task.done).length

  const completedHabits = habits.filter((habit) => habit.checked).length

  const taskRate =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0

  const habitRate =
    habits.length > 0
      ? Math.round((completedHabits / habits.length) * 100)
      : 0

  const averageGoalProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum, goal) => sum + goal.progress, 0) /
            goals.length,
        )
      : 0

  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: COLORS.mint },
    { name: 'Remaining', value: activeTasks, color: COLORS.violet },
  ]

  const habitStatusData = [
    { name: 'Checked in', value: completedHabits, color: COLORS.mint },
    {
      name: 'Not checked',
      value: habits.length - completedHabits,
      color: COLORS.purple,
    },
  ]

  const priorityData = ['High', 'Medium', 'Low'].map((priority) => ({
    priority,
    count: tasks.filter((task) => task.priority === priority).length,
  }))

  const goalProgressData = goals.slice(0, 6).map((goal) => ({
    name:
      goal.title.length > 18
        ? `${goal.title.slice(0, 18)}…`
        : goal.title,
    fullName: goal.title,
    progress: goal.progress,
  }))

  const hasTasks = tasks.length > 0
  const hasGoals = goals.length > 0
  const hasHabits = habits.length > 0

  return (
    <div className="page-enter space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-3xl border border-violet-300/15 bg-gradient-to-br from-[#21183b] via-[#171529] to-[#101a22] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-violet-200">
              <Activity size={16} />
              <span>Life intelligence</span>
            </div>

            <h1 className="display-font text-3xl font-bold text-white sm:text-4xl">
              Your analytics
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              A clearer view of your tasks, goals, and daily habits.
              Your numbers update as you make changes across LifeOS.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-xs font-medium text-teal-200">
            <span className="h-2 w-2 rounded-full bg-teal-300" />
            Live from your current data
          </div>
        </div>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Task completion"
          value={`${taskRate}%`}
          description={`${completedTasks} completed out of ${tasks.length} total tasks`}
          icon={<ListTodo size={21} />}
          accent={COLORS.violet}
        />

        <StatCard
          label="Average goal progress"
          value={`${averageGoalProgress}%`}
          description={`${goals.length} goals currently on your board`}
          icon={<Target size={21} />}
          accent={COLORS.mint}
        />

        <StatCard
          label="Habit check-ins"
          value={`${completedHabits}/${habits.length}`}
          description={`${habitRate}% of your listed habits are checked`}
          icon={<CheckCircle2 size={21} />}
          accent={COLORS.blue}
        />

        <StatCard
          label="Tasks remaining"
          value={activeTasks}
          description="Tasks still waiting for your attention"
          icon={<CircleDashed size={21} />}
          accent={COLORS.pink}
        />
      </section>

      {/* Donut charts */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Task completion"
          subtitle="Completed tasks compared with tasks remaining"
        >
          {hasTasks ? (
            <>
              <div className="relative h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={72}
                      outerRadius={100}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {taskStatusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold text-white">
                    {taskRate}%
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    completed
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                {taskStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-slate-400">
                      {item.name}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyChart message="Add a task to start seeing your completion data." />
          )}
        </ChartCard>

        <ChartCard
          title="Habit check-ins"
          subtitle="A snapshot of the habits you've checked today"
        >
          {hasHabits ? (
            <>
              <div className="relative h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={habitStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={72}
                      outerRadius={100}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {habitStatusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold text-white">
                    {habitRate}%
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    checked in
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                {habitStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-slate-400">
                      {item.name}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyChart message="Add some habits to see your check-in breakdown." />
          )}
        </ChartCard>
      </section>

      {/* Bar charts */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Goal progress"
          subtitle="Your current progress toward each goal"
        >
          {hasGoals ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={goalProgressData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid
                    stroke={COLORS.grid}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: '#9998b2', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={112}
                    tick={{ fill: '#c4c1d8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value}%`, 'Progress']}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.fullName ?? ''
                    }
                  />
                  <Bar
                    dataKey="progress"
                    name="Progress"
                    fill={COLORS.violet}
                    radius={[0, 7, 7, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart message="Create a goal to see its progress here." />
          )}
        </ChartCard>

        <ChartCard
          title="Task priorities"
          subtitle="How your current tasks are distributed"
        >
          {hasTasks ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{ top: 12, right: 8, left: -20, bottom: 4 }}
                >
                  <CartesianGrid
                    stroke={COLORS.grid}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="priority"
                    tick={{ fill: '#9998b2', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: '#9998b2', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="count"
                    name="Tasks"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={54}
                  >
                    {priorityData.map((entry) => (
                      <Cell
                        key={entry.priority}
                        fill={
                          entry.priority === 'High'
                            ? '#f0abfc'
                            : entry.priority === 'Medium'
                              ? COLORS.violet
                              : COLORS.mint
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart message="Add tasks to see your priority distribution." />
          )}
        </ChartCard>
      </section>

      {/* Closing insight */}
      <section className="panel rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <Sparkles size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-white">A little perspective</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {tasks.length === 0 && goals.length === 0 && habits.length === 0
                ? 'Your analytics will grow as you add tasks, goals, and habits. Start small and build your system one step at a time.'
                : taskRate === 100 && tasks.length > 0
                  ? 'Every task on your current list is complete. Take a moment to appreciate your progress, then decide what matters next.'
                  : averageGoalProgress >= 70 && goals.length > 0
                    ? 'Your average goal progress is looking strong. Keep your next steps small and consistent.'
                    : 'Your dashboard reflects where things stand right now. Use these numbers as information, not as a judgment of your worth.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center px-5 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-400">
        <Activity size={22} />
      </div>
      <p className="max-w-xs text-sm leading-6 text-slate-400">
        {message}
      </p>
    </div>
  )
}
