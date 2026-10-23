<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMyRequests } from '../api/approvals'
import { useSession } from '../composables/useSession'
import { APPROVAL_LABEL, type Approval } from '../types'

const { staffId } = useSession()
const rows = ref<Approval[]>([])

async function load() {
  if (staffId.value != null) rows.value = await getMyRequests(staffId.value)
}

onMounted(load)
</script>

<template>
  <main class="mx-auto max-w-4xl space-y-4 p-6">
    <p class="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500">File // My Requests</p>
    <div class="flex items-center justify-between">
      <h1 class="font-mono text-xl">我的申請</h1>
      <RouterLink :to="{ name: 'request-new' }" class="border border-amber-600 bg-amber-500 px-3 py-1 text-sm font-semibold text-zinc-950">
        提出申請
      </RouterLink>
    </div>
    <ul class="space-y-3">
      <li v-for="row in rows" :key="row.id" class="border border-stone-700 bg-zinc-900 p-4 text-sm">
        <p>{{ APPROVAL_LABEL[row.type] }} · {{ row.customerName }} · {{ row.submittedAt }}</p>
        <p class="mt-1 text-stone-400">{{ row.note }}</p>
        <p
          class="mt-1"
          :class="row.status === 'approved' ? 'text-green-400' : row.status === 'rejected' ? 'text-red-300' : 'text-stone-400'"
        >
          狀態：{{ row.status === 'pending' ? '待審' : row.status === 'approved' ? '已核准' : '已駁回' }}
        </p>
        <p v-if="row.status === 'rejected'" class="mt-1 text-red-300">駁回原因：{{ row.rejectReason }}</p>
      </li>
      <li v-if="rows.length === 0" class="text-stone-500">目前沒有申請</li>
    </ul>
  </main>
</template>
