<script setup lang="ts">
import { STAFF_LABEL, type Customer } from '../types'

type Header = { text: string; value: string }
type ServerOptions = { page: number; rowsPerPage: number }

defineProps<{ rows: Customer[]; loading: boolean; total: number }>()
const serverOptions = defineModel<ServerOptions>('serverOptions', { required: true })

const headers: Header[] = [
  { text: 'ID', value: 'id' },
  { text: '名稱', value: 'name' },
  { text: '負責人', value: 'staffId' },
]
</script>

<template>
  <div class="overflow-hidden border border-stone-700 bg-zinc-900">
    <EasyDataTable
      v-model:server-options="serverOptions"
      :headers="headers"
      :items="rows"
      :loading="loading"
      :server-items-length="total"
      buttons-pagination
      theme-color="#f59e0b"
      empty-message="沒有符合條件的客戶"
      loading-text="載入中…"
    >
      <template #item-staffId="{ staffId }">
        {{ STAFF_LABEL[staffId] ?? staffId }}
      </template>
    </EasyDataTable>
  </div>
</template>
