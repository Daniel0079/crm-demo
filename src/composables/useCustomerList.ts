import { computed, ref, watch } from 'vue'
import { getCustomers } from '../api/customers'
import { useSession } from './useSession'
import { usePendingApprovals } from './usePendingApprovals'
import type { Customer } from '../types'

type ServerOptions = { page: number; rowsPerPage: number }

export function useCustomerList() {
  const { role, staffId: sessionStaffId } = useSession()
  const { listVersion } = usePendingApprovals()
  const staffId = computed(() => (role.value === 'manager' ? null : sessionStaffId.value))

  const keyword = ref('')
  const rows = ref<Customer[]>([])
  const total = ref(0)
  const loading = ref(false)
  const serverOptions = ref<ServerOptions>({ page: 1, rowsPerPage: 20 })
  let timer: ReturnType<typeof setTimeout> | undefined
  let reqId = 0

  async function fetchCustomers() {
    const current = ++reqId
    loading.value = true
    try {
      const res = await getCustomers({
        keyword: keyword.value,
        page: serverOptions.value.page,
        pageSize: serverOptions.value.rowsPerPage,
        staffId: staffId.value,
      })
      if (current !== reqId) return
      rows.value = res.rows
      total.value = res.total
    } finally {
      if (current === reqId) loading.value = false
    }
  }

  watch(serverOptions, fetchCustomers, { deep: true })
  watch(role, () => {
    serverOptions.value.page = 1
    fetchCustomers()
  })
  watch(listVersion, fetchCustomers)

  function onKeywordInput(val: string) {
    keyword.value = val
    clearTimeout(timer)
    timer = setTimeout(() => {
      serverOptions.value.page = 1
      fetchCustomers()
    }, 300)
  }

  return { staffId, keyword, rows, total, loading, serverOptions, fetchCustomers, onKeywordInput }
}
