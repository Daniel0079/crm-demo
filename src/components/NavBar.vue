<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSession } from '../composables/useSession'

defineProps<{ pendingCount: number }>()
const { isManager, displayName, logout } = useSession()
const router = useRouter()

function onLogout() {
  logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="flex items-center justify-between border-b-4 border-amber-500 bg-zinc-900 px-6 py-3">
    <strong class="font-mono text-sm tracking-[0.2em] text-amber-400">CRM // PRACTICE</strong>
    <nav class="flex items-center gap-5 font-mono text-xs uppercase tracking-wider">
      <RouterLink to="/customers" class="text-stone-400 hover:text-amber-400" active-class="text-amber-400">
        客戶列表
      </RouterLink>
      <RouterLink
        v-if="!isManager"
        to="/my-requests"
        class="text-stone-400 hover:text-amber-400"
        active-class="text-amber-400"
      >
        我的申請
      </RouterLink>
      <RouterLink
        v-if="isManager"
        to="/pending"
        class="relative px-3 py-1 text-stone-400 hover:text-amber-400"
        active-class="text-amber-400"
      >
        <span
          v-if="pendingCount > 0"
          class="absolute -left-1 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white"
        >
          {{ pendingCount }}
        </span>
        待審核
      </RouterLink>
      <span class="text-stone-500">{{ displayName }}</span>
      <button type="button" class="border border-stone-600 bg-zinc-800 px-2 py-1 hover:border-amber-500" @click="onLogout">
        登出
      </button>
    </nav>
  </header>
</template>
