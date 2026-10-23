<script setup lang="ts">
import { onMounted } from 'vue'
import type { Header } from 'vue3-easy-data-table'
import { usePendingApprovals } from '../composables/usePendingApprovals'
import { APPROVAL_LABEL, STAFF_LABEL } from '../types'

const { approvals, loading, fetchApprovals } = usePendingApprovals()
onMounted(() => fetchApprovals(true))

const headers: Header[] = [
  { text: 'ID', value: 'id' },
  { text: '類型', value: 'type' },
  { text: '客戶', value: 'customerName' },
  { text: '原負責人', value: 'staffId' },
  { text: '送出日期', value: 'submittedAt' },
  { text: '', value: 'actions' },
]
</script>

<template>
  <main class="mx-auto max-w-4xl space-y-4 p-6">
    <p class="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500">File // Approvals</p>
    <h1 class="font-mono text-xl">待審核申請</h1>
    <div class="overflow-hidden border border-stone-700 bg-zinc-900">
      <EasyDataTable
        :headers="headers"
        :items="approvals"
        :loading="loading"
        theme-color="#f59e0b"
        empty-message="目前沒有待審項目"
        loading-text="載入中…"
      >
        <template #item-type="{ type }">
          {{ APPROVAL_LABEL[type as keyof typeof APPROVAL_LABEL] }}
        </template>
        <template #item-staffId="{ staffId }">
          {{ STAFF_LABEL[staffId] ?? staffId }}
        </template>
        <template #item-actions="{ id }">
          <RouterLink :to="{ name: 'pending-detail', params: { id } }" class="text-amber-400">
            開啟審核
          </RouterLink>
        </template>
      </EasyDataTable>
    </div>
  </main>
</template>
