import { computed, ref } from 'vue'
import { decideApproval, getApprovals, submitApproval } from '../api/approvals'
import type { Approval } from '../types'

const approvals = ref<Approval[]>([])
const loading = ref(false)
const loaded = ref(false)
const listVersion = ref(0)

export function usePendingApprovals() {
  const pendingCount = computed(() => approvals.value.length)

  async function fetchApprovals(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    try {
      approvals.value = await getApprovals()
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function decide(
    id: number,
    decision: 'approved' | 'rejected',
    newStaffId?: number,
    rejectReason?: string,
  ) {
    await decideApproval(id, decision, newStaffId, rejectReason)
    approvals.value = approvals.value.filter((a) => a.id !== id)
    listVersion.value += 1
  }

  async function submit(input: Parameters<typeof submitApproval>[0]) {
    await submitApproval(input)
    loaded.value = false
    await fetchApprovals(true)
    listVersion.value += 1
  }

  return { approvals, loading, pendingCount, listVersion, fetchApprovals, decide, submit }
}
