
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import {
  Activity,
  BookHeart,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  LayoutDashboard,
  ListTodo,
  Sparkles,
  Target,
  Timer,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

import Overview from './pages/Overview'
import Tasks from './pages/Tasks'
import Goals from './pages/Goals'
import Habits from './pages/Habits'
import Analytics from './pages/Analytics'
import Calendar from './pages/Calendar'
import Journal from './pages/Journal'
import FocusMode from './pages/FocusMode'

const navigation = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Tasks', path: '/tasks', icon: ListTodo },
  { label: 'Goals', path: '/goals', icon: Target },
  { label: 'Habits', path: '/habits', icon: Activity },
  { label: 'Analytics', path: '/analytics', icon: ChartNoAxesCombined },
  { label: 'Calendar', path: '/calendar', icon: CalendarDays },
  { label: 'Journal', path: '/journal', icon: BookHeart },
  { label: 'Focus Mode', path: '/focus', icon: Timer },
]

function getPageTitle(pathname: string) {
  return navigation.find((item) => item.path === pathname)?.label ?? 'Overview'
}

export default function App() {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="app-backdrop min-h-screen text-[#302b45]">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        {/* Desktop sidebar */}
        <aside className="lifeos-sidebar sticky top-0 hidden h-screen w-[252px] shrink-0 flex-col border-r px-5 py-7 lg:flex">
          <NavBrand />

          <p className="mb-3 mt-11 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#aaa2b8]">
            Your workspace
          </p>

          <Navigation />

          <div className="mt-auto">
            <InspirationCard />

            <p className="mt-5 px-2 text-[10px] tracking-[0.12em] text-[#aaa2b8]">
              LIFEOS · PERSONAL EDITION
            </p>
          </div>
        </aside>

        {/* Main application */}
        <div className="min-w-0 flex-1">
          <header className="lifeos-topbar sticky top-0 z-30 border-b backdrop-blur-2xl">
            <div className="flex min-h-[78px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
              <div className="flex min-w-0 items-center gap-3">
                <div className="lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
                    aria-expanded={mobileMenuOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9e2f1] bg-white text-[#65538f] shadow-sm"
                  >
                    {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
                  </button>
                </div>

                <div className="hidden min-w-0 sm:block">
                  <div className="flex items-center gap-2 text-xs text-[#9a92a9]">
                    <span>LifeOS</span>
                    <ChevronRight size={12} />
                    <span className="font-medium text-[#514568]">
                      {pageTitle}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[#928ba0]">
                    A little more intention, every day.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-[#dce9de] bg-[#f0f6f0] px-3 py-2 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-[#83a98d]" />
                  <span className="text-xs font-medium text-[#577761]">
                    Your space to grow
                  </span>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5dcf5] bg-gradient-to-br from-[#eee5fb] to-[#e8f1e8] text-[#7966ae]">
                  <Sparkles size={18} />
                </div>
              </div>
            </div>

            {/* Mobile dropdown navigation */}
            {mobileMenuOpen && (
              <div className="border-t border-[#eee7f3] bg-[#fffdfa] px-4 py-3 lg:hidden">
                <Navigation onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            )}

            {/* Mobile page navigation */}
            <nav
              className="flex gap-1 overflow-x-auto border-t border-[#eee7f3] px-3 py-2 lg:hidden"
              aria-label="Mobile page navigation"
            >
              {navigation.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs transition-all ${
                        isActive
                          ? 'bg-[#eee7fa] font-medium text-[#6e5aab]'
                          : 'text-[#898197] hover:bg-[#f4f0f8]'
                      }`
                    }
                  >
                    <Icon size={14} />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>
          </header>

          <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-[1400px] page-enter">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/focus" element={<FocusMode />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <footer className="mt-12 flex flex-col gap-2 border-t border-[#e9e2ef] py-5 text-xs text-[#9b94a8] sm:flex-row sm:items-center sm:justify-between">
                <span>LifeOS · Make room for what matters.</span>

                <span className="flex items-center gap-2">
                  <Check size={14} className="text-[#7fa58a]" />
                  Progress at your own pace
                </span>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function NavBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#dfd3f5] bg-gradient-to-br from-[#e8ddfa] via-[#f4eafb] to-[#e3f0e5] text-[#7b66b5] shadow-[0_8px_22px_rgba(139,120,198,0.12)]">
        <Sparkles size={23} />
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-[#8ca995]" />
      </div>

      <div>
        <p className="display-font text-[23px] font-bold tracking-tight text-[#342c4b]">
          Life<span className="text-[#8b78c6]">OS</span>
        </p>
        <p className="mt-0.5 text-[9px] font-medium tracking-[0.16em] text-[#9b91ae]">
          YOUR LIFE, IN FOCUS
        </p>
      </div>
    </div>
  )
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
      {navigation.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl border px-3 py-3 transition-all duration-200 ${
                isActive
                  ? 'border-[#e5dcf5] bg-gradient-to-r from-[#f0eafb] to-[#faf6fd] text-[#6954a3] shadow-[0_4px_12px_rgba(113,91,165,0.05)]'
                  : 'border-transparent text-[#817b91] hover:border-[#eee7f3] hover:bg-white/80 hover:text-[#504568]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-[#9b86d5]" />
                )}

                <Icon
                  size={18}
                  className={
                    isActive
                      ? 'text-[#8b78c6]'
                      : 'text-[#a49bb5] group-hover:text-[#8b78c6]'
                  }
                />

                <span className="text-sm font-medium">{item.label}</span>

                {isActive && (
                  <ChevronRight
                    size={15}
                    className="ml-auto text-[#a493d2]"
                  />
                )}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

function InspirationCard() {
  return (
    <div className="illustration-surface p-4">
      <div className="illustration-orb right-[-20px] top-[-22px] h-24 w-24 bg-[#e1d5f7]/80" />
      <div className="illustration-orb bottom-[-30px] left-[-12px] h-24 w-24 bg-[#d9eadb]/80" />

      <div className="relative mb-4 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/80 bg-white/75 text-[#8b78c6] shadow-sm">
          <Sparkles size={18} />
        </div>
        <span className="rounded-full border border-white/80 bg-white/60 px-2.5 py-1 text-[10px] font-medium text-[#8270af]">
          A gentle reminder
        </span>
      </div>

      <p className="relative text-sm font-semibold text-[#45395d]">
        You don't have to do it all today.
      </p>

      <p className="relative mt-2 text-xs leading-5 text-[#827990]">
        Small, consistent steps can take you somewhere beautiful.
      </p>

      <div className="relative mt-4 flex items-center gap-2 text-[11px] font-medium text-[#66816e]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8ca995]" />
        Grow at your own pace
      </div>

      <div className="pointer-events-none absolute bottom-1 right-3 opacity-50">
        <MiniBotanical />
      </div>
    </div>
  )
}

function MiniBotanical() {
  return (
    <svg
      viewBox="0 0 64 72"
      width="54"
      height="60"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M31 66 C32 47 31 28 42 9"
        stroke="#789c82"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M31 48 C15 46 10 36 11 27 C23 29 31 36 31 48Z"
        fill="#b5d0b6"
      />
      <path
        d="M35 34 C36 21 44 15 53 15 C52 26 45 33 35 34Z"
        fill="#c8b7e8"
      />
      <path
        d="M31 59 C20 60 15 54 14 47 C24 47 30 52 31 59Z"
        fill="#d9c9ee"
      />
      <circle cx="42" cy="8" r="4" fill="#e7c39f" />
    </svg>
  )
}
