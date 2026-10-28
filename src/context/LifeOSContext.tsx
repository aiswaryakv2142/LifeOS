
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type TaskPriority = 'High' | 'Medium' | 'Low'

export type TaskCategory =
  | 'Career'
  | 'Study'
  | 'Personal'
  | 'Health'
  | 'Other'

export type Task = {
  id: number
  title: string
  priority: TaskPriority
  done: boolean
  dueDate?: string
  category?: TaskCategory
  createdAt?: string
}

export type Goal = {
  id: number
  title: string
  category: string
  progress: number
}

export type Habit = {
  id: number
  name: string
  checked: boolean
}

type LifeOSData = {
  tasks: Task[]
  goals: Goal[]
  habits: Habit[]
}

export type NewTaskDetails = {
  dueDate?: string
  category?: TaskCategory
}

type LifeOSContextType = LifeOSData & {
  addTask: (
    title: string,
    priority: TaskPriority,
    details?: NewTaskDetails,
  ) => void
  updateTask: (
    id: number,
    updates: Partial<Pick<Task, 'title' | 'priority' | 'dueDate' | 'category'>>,
  ) => void
  toggleTask: (id: number) => void
  deleteTask: (id: number) => void
  addGoal: (title: string, category: string) => void
  updateGoalProgress: (id: number, progress: number) => void
  deleteGoal: (id: number) => void
  toggleHabit: (id: number) => void
}

const STORAGE_KEY = 'lifeos-data-v1'

const defaultData: LifeOSData = {
  tasks: [
    {
      id: 1,
      title: 'Build my personal portfolio',
      priority: 'High',
      done: false,
    },
    {
      id: 2,
      title: 'Study for 30 minutes',
      priority: 'Medium',
      done: false,
    },
    {
      id: 3,
      title: 'Plan tomorrow',
      priority: 'Low',
      done: true,
    },
  ],
  goals: [
    {
      id: 1,
      title: 'Build a strong portfolio',
      category: 'Career',
      progress: 35,
    },
    {
      id: 2,
      title: 'Learn full-stack development',
      category: 'Learning',
      progress: 20,
    },
  ],
  habits: [
    {
      id: 1,
      name: 'Read or learn something new',
      checked: false,
    },
    {
      id: 2,
      name: 'Move my body',
      checked: false,
    },
    {
      id: 3,
      name: 'Plan tomorrow',
      checked: true,
    },
  ],
}

function loadData(): LifeOSData {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)

    if (savedData) {
      const parsedData = JSON.parse(savedData)

      if (
        Array.isArray(parsedData.tasks) &&
        Array.isArray(parsedData.goals) &&
        Array.isArray(parsedData.habits)
      ) {
        // Keep existing records intact. Older tasks do not need to have
        // due dates, categories, or creation dates yet.
        return {
          tasks: parsedData.tasks,
          goals: parsedData.goals,
          habits: parsedData.habits,
        } as LifeOSData
      }
    }
  } catch (error) {
    console.error('Could not load LifeOS data:', error)
  }

  return defaultData
}

const LifeOSContext = createContext<LifeOSContextType | undefined>(
  undefined,
)

export function LifeOSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LifeOSData>(loadData)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Could not save LifeOS data:', error)
    }
  }, [data])

  function addTask(
    title: string,
    priority: TaskPriority,
    details: NewTaskDetails = {},
  ) {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const newTask: Task = {
      id: Date.now(),
      title: trimmedTitle,
      priority,
      done: false,
      ...(details.dueDate ? { dueDate: details.dueDate } : {}),
      category: details.category ?? 'Other',
      createdAt: new Date().toISOString(),
    }

    setData((current) => ({
      ...current,
      tasks: [newTask, ...current.tasks],
    }))
  }

  function updateTask(
    id: number,
    updates: Partial<Pick<Task, 'title' | 'priority' | 'dueDate' | 'category'>>,
  ) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => {
        if (task.id !== id) return task

        const nextTask = { ...task, ...updates }
        nextTask.title = nextTask.title.trim()

        if (!nextTask.title) return task

        // An empty date removes the due date.
        if (!nextTask.dueDate) delete nextTask.dueDate

        return nextTask
      }),
    }))
  }

  function toggleTask(id: number) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    }))
  }

  function deleteTask(id: number) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== id),
    }))
  }

  function addGoal(title: string, category: string) {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const newGoal: Goal = {
      id: Date.now(),
      title: trimmedTitle,
      category,
      progress: 0,
    }

    setData((current) => ({
      ...current,
      goals: [newGoal, ...current.goals],
    }))
  }

  function updateGoalProgress(id: number, progress: number) {
    const safeProgress = Math.min(100, Math.max(0, progress))

    setData((current) => ({
      ...current,
      goals: current.goals.map((goal) =>
        goal.id === id ? { ...goal, progress: safeProgress } : goal,
      ),
    }))
  }

  function deleteGoal(id: number) {
    setData((current) => ({
      ...current,
      goals: current.goals.filter((goal) => goal.id !== id),
    }))
  }

  function toggleHabit(id: number) {
    setData((current) => ({
      ...current,
      habits: current.habits.map((habit) =>
        habit.id === id
          ? { ...habit, checked: !habit.checked }
          : habit,
      ),
    }))
  }

  return (
    <LifeOSContext.Provider
      value={{
        ...data,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        addGoal,
        updateGoalProgress,
        deleteGoal,
        toggleHabit,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  )
}

export function useLifeOS() {
  const context = useContext(LifeOSContext)

  if (!context) {
    throw new Error('useLifeOS must be used inside a LifeOSProvider')
  }

  return context
}
