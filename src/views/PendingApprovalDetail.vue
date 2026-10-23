<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getApprovalById } from '../api/approvals'
import { usePendingApprovals } from '../composables/usePendingApprovals'
import { APPROVAL_LABEL, STAFF_LABEL, type Approval } from '../types'

const props = defineProps<{ id: string }>()
const router = useRouter()
const { decide } = usePendingApprovals()
const detail = ref<Approval | null>(null)
const loading = ref(false)
const notFound = ref(false)
const newStaffId = ref(2)
const showReject = ref(false)
const rejectReason = ref('')
const error = ref('')

async function loadDetail(id: number) {
  loading.value = true
  notFound.value = false
  detail.value = null
  const result = await getApprovalById(id)
  notFound.value = !result || result.status !== 'pending'
  detail.value = result && result.status === 'pending' ? result : null
  if (result?.type === 'reassign') newStaffId.value = result.payload.newStaffId ?? 2
  loading.value = false
}

watch(() => props.id, (id) => loadDetail(Number(id)), { immediate: true })

async function approve() {
  if (!detail.value) return
  await decide(
    detail.value.id,
    'approved',
    detail.value.type === 'reassign' ? Number(newStaffId.value) : undefined,
  )
  router.push({ name: 'pending-list' })
}

async function reject() {
  error.value = ''
  if (!rejectReason.value.trim()) {
    error.value = '請填駁回原因'
    return
  }
  if (!detail.value) return
  await decide(detail.value.id, 'rejected', undefined, rejectReason.value.trim())
  router.push({ name: 'pending-list' })
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <RouterLink :to="{ name: 'pending-list' }" class="text-sm text-stone-500 hover:text-amber-400">← 返回</RouterLink>
    <div class="border border-stone-700 bg-zinc-900 p-6">
      <p v-if="loading" class="text-amber-500">載入中…</p>
      <p v-else-if="notFound" class="text-red-400">這筆不在待審，或已處理</p>
      <div v-else-if="detail" class="space-y-4">
        <p class="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500">File // Approval #{{ detail.id }}</p>
        <h1 class="font-mono text-xl">{{ APPROVAL_LABEL[detail.type] }}</h1>
        <p class="text-sm text-stone-400">
          {{ detail.customerName }} · 原負責人 {{ STAFF_LABEL[detail.staffId] }} · {{ detail.submittedAt }}
        </p>
        <p class="text-sm">{{ detail.note }}</p>
        <label v-if="detail.type === 'reassign'" class="block text-sm text-stone-400">
          核准後改掛到
          <select v-model.number="newStaffId" class="mt-1 w-full border border-stone-600 bg-zinc-950 px-2 py-1">
            <option :value="1">員工一 staff1</option>
            <option :value="2">員工二 staff2</option>
            <option :value="3">員工三 staff3</option>
          </select>
        </label>
        <p v-else-if="detail.type === 'phone'" class="text-sm">電話：{{ detail.payload.oldPhone }} → {{ detail.payload.newPhone }}</p>
        <p v-else-if="detail.type === 'address'" class="text-sm">地址：{{ detail.payload.oldAddress }} → {{ detail.payload.newAddress }}</p>
        <p v-else-if="detail.type === 'credit'" class="text-sm">額度：{{ detail.payload.oldCredit }} → {{ detail.payload.newCredit }}</p>
        <div v-if="showReject" class="space-y-2">
          <label class="block text-sm text-stone-400">
            駁回原因
            <textarea v-model="rejectReason" rows="3" class="mt-1 w-full border border-stone-600 bg-zinc-950 px-2 py-1" />
          </label>
          <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
        </div>
        <div class="flex gap-3">
          <button type="button" class="border border-amber-600 bg-amber-500 px-4 py-1.5 text-sm font-semibold text-zinc-950" @click="approve">核准</button>
          <button v-if="!showReject" type="button" class="border border-red-800 bg-red-950 px-4 py-1.5 text-sm" @click="showReject = true">駁回</button>
          <button v-else type="button" class="border border-red-800 bg-red-950 px-4 py-1.5 text-sm" @click="reject">確認駁回</button>
        </div>
      </div>
    </div>
  </main>
</template>
