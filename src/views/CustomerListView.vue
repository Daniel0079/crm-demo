<script setup lang="ts">
import { onMounted } from 'vue'
import CustomerTable from '../components/CustomerTable.vue'
import { useCustomerList } from '../composables/useCustomerList'
import { useSession } from '../composables/useSession'

const { displayName, isManager } = useSession()
const { keyword, rows, total, loading, serverOptions, fetchCustomers, onKeywordInput } = useCustomerList()
onMounted(fetchCustomers)
</script>

<template>
  <main class="mx-auto max-w-4xl space-y-4 p-6">
    <p class="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500">File // Customers</p>
    <h1 class="font-mono text-xl">客戶列表</h1>
    <p class="text-sm text-stone-500">
      {{ displayName }} · {{ isManager ? '主管看全部' : '只看自己的客戶' }} · 權限 → 關鍵字 → 每頁 20 筆
    </p>
    <label class="block max-w-xs">
      <span class="mb-1 block font-mono text-xs text-stone-400">客戶名稱</span>
      <input
        :value="keyword"
        placeholder="輸入即篩選，停 300ms 才查"
        class="w-full border border-stone-600 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-amber-500"
        @input="onKeywordInput(($event.target as HTMLInputElement).value)"
      />
    </label>
    <CustomerTable v-model:server-options="serverOptions" :rows="rows" :loading="loading" :total="total" />
  </main>
</template>
