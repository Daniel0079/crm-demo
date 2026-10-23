import { computed, ref } from 'vue'

export type Role = 'staff' | 'manager'

const SESSION_KEY = 'crm.session'
const REMEMBER_KEY = 'crm.rememberUser'

const role = ref<Role>('staff')
const staffId = ref<number | null>(null)
const isLoggedIn = ref(false)
const displayName = ref('')

const USERS = [
  { username: 'staff1', password: '1234', role: 'staff' as Role, staffId: 1, name: '員工一' },
  { username: 'staff2', password: '1234', role: 'staff' as Role, staffId: 2, name: '員工二' },
  { username: 'boss', password: '1234', role: 'manager' as Role, staffId: null, name: '主管' },
]

function persistSession() {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ role: role.value, staffId: staffId.value, displayName: displayName.value }),
  )
}

function restoreSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return
  try {
    const saved = JSON.parse(raw) as { role: Role; staffId: number | null; displayName: string }
    role.value = saved.role
    staffId.value = saved.staffId
    displayName.value = saved.displayName
    isLoggedIn.value = true
  } catch {
    localStorage.removeItem(SESSION_KEY)
  }
}

restoreSession()

export function useSession() {
  const isManager = computed(() => isLoggedIn.value && role.value === 'manager')

  function login(username: string, password: string, remember = false) {
    const user = USERS.find((u) => u.username === username && u.password === password)
    if (!user) return false
    role.value = user.role
    staffId.value = user.staffId
    displayName.value = user.name
    isLoggedIn.value = true
    persistSession()
    if (remember) localStorage.setItem(REMEMBER_KEY, username)
    else localStorage.removeItem(REMEMBER_KEY)
    return true
  }

  function logout() {
    isLoggedIn.value = false
    displayName.value = ''
    staffId.value = null
    role.value = 'staff'
    localStorage.removeItem(SESSION_KEY)
  }

  function rememberedUsername() {
    return localStorage.getItem(REMEMBER_KEY) ?? ''
  }

  return { role, staffId, isLoggedIn, isManager, displayName, login, logout, rememberedUsername }
}
