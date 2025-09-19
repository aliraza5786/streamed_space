// useTheme.ts
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'
const STORAGE_KEY = 'theme'

// ---- Your variable palettes (match the CSS in your global file) ----
const LIGHT_VARS: Record<string, string> = {
  '--surface': '#ffffff',
  '--surface-2': '#f3f4f6',
  '--card': '#ffffff',
  '--text': '#0f172a',
  '--muted': '#6b7280',
  '--border': '#e5e7eb',
  '--background': '#ffffff',
}

const DARK_VARS: Record<string, string> = {
  '--surface': '#0f1115',
  '--surface-2': '#1a1f2b',
  '--card': '#12151d',
  '--text': '#e5e7eb',
  '--muted': '#9ca3af',
  '--border': '#303948',
  '--background': '#1b1b1b',
}

// Optional: also set the browser UI color (Android address bar, etc.)
function setThemeColorMeta(hex: string) {
  let el = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!el) {
    el = document.createElement('meta')
    el.name = 'theme-color'
    document.head.appendChild(el)
  }
  el.content = hex
}

// Apply a set of CSS variables to :root inline (wins over stylesheet)
function applyCSSVars(vars: Record<string, string>) {
  const root = document.documentElement
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v)
  }
}

const theme = ref<ThemeMode>((localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system')
const systemPrefersDark = ref<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches)
const isDark = computed(() => theme.value === 'dark' || (theme.value === 'system' && systemPrefersDark.value))

function applyTheme() {
  const root = document.documentElement

  // 1) Toggle class for any Tailwind `dark:` variants you still use
  root.classList.toggle('dark', isDark.value)

  // 2) Set data attribute (if your CSS uses [data-theme="dark"])
  root.setAttribute('data-theme', isDark.value ? 'dark' : 'light')

  // 3) Update the CSS variables programmatically so components using
  //    bg-[var(--card)] / .bg-card / .text-body etc. change immediately
  applyCSSVars(isDark.value ? DARK_VARS : LIGHT_VARS)

  // 4) Optional: update theme-color meta
  setThemeColorMeta(isDark.value ? DARK_VARS['--background'] : LIGHT_VARS['--background'])
}

function setTheme(next: ThemeMode) {
  theme.value = next
  localStorage.setItem(STORAGE_KEY, next)
  applyTheme()
}

function toggleTheme() {
  // toggles between explicit light/dark (doesn't cycle through system)
  setTheme(isDark.value ? 'light' : 'dark')
}

// single set of listeners even if composable is used in many places
let mountedCount = 0
let mql: MediaQueryList | null = null
function onSystemChange(e: MediaQueryListEvent) {
  systemPrefersDark.value = e.matches
  if (theme.value === 'system') applyTheme()
}
function onStorage(e: StorageEvent) {
  if (e.key === STORAGE_KEY && e.newValue) {
    theme.value = e.newValue as ThemeMode
    applyTheme()
  }
}

export function useTheme() {
  onMounted(() => {
    mountedCount++
    if (mountedCount === 1) {
      // initialize from storage (in case your head script didn’t run)
      theme.value = (localStorage.getItem(STORAGE_KEY) as ThemeMode) || theme.value
      applyTheme()

      mql = window.matchMedia('(prefers-color-scheme: dark)')
      systemPrefersDark.value = mql.matches
      mql.addEventListener('change', onSystemChange)
      window.addEventListener('storage', onStorage)
    } else {
      applyTheme()
    }
  })

  onBeforeUnmount(() => {
    mountedCount--
    if (mountedCount === 0) {
      mql?.removeEventListener('change', onSystemChange)
      window.removeEventListener('storage', onStorage)
      mql = null
    }
  })

  return { theme, isDark, setTheme, toggleTheme }
}
