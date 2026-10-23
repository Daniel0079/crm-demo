<script setup lang="ts">
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import { usePendingApprovals } from './composables/usePendingApprovals'
import { useSession } from './composables/useSession'

const { pendingCount, fetchApprovals } = usePendingApprovals()
const { isLoggedIn } = useSession()
onMounted(() => fetchApprovals())
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-stone-200">
    <NavBar v-if="isLoggedIn" :pending-count="pendingCount" />
    <RouterView />
  </div>
</template>
