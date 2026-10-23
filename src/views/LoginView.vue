<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '../composables/useSession'

const router = useRouter()
const { login, rememberedUsername } = useSession()
const username = ref(rememberedUsername())
const password = ref('')
const remember = ref(!!rememberedUsername())
const error = ref('')

async function submit() {
  error.value = ''
  if (!login(username.value.trim(), password.value, remember.value)) {
    error.value = '帳號或密碼錯誤'
    return
  }
  await router.replace({ name: 'customers' })
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center p-6">
    <form class="w-full max-w-sm border border-stone-700 bg-zinc-900 p-6" @submit.prevent="submit">
      <p class="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500">Access Control</p>
      <h1 class="mb-5 mt-1 font-mono text-2xl">系統登入</h1>
      <label class="mb-3 block font-mono text-xs text-stone-400">
        帳號
        <input v-model="username" class="mt-1 w-full border border-stone-600 bg-zinc-950 px-3 py-2 text-stone-100 outline-none focus:border-amber-500" />
      </label>
      <label class="mb-3 block font-mono text-xs text-stone-400">
        密碼
        <input v-model="password" type="password" class="mt-1 w-full border border-stone-600 bg-zinc-950 px-3 py-2 text-stone-100 outline-none focus:border-amber-500" />
      </label>
      <label class="mb-3 flex items-center gap-2 font-mono text-xs text-stone-500">
        <input v-model="remember" type="checkbox" class="accent-amber-500" />
        記住我
      </label>
      <p v-if="error" class="mb-2 font-mono text-xs text-red-400">{{ error }}</p>
      <button type="submit" class="w-full border border-amber-600 bg-amber-500 py-2 font-mono text-sm font-semibold text-zinc-950">
        進入
      </button>
      <p class="mt-4 font-mono text-[10px] text-stone-600">staff1 / staff2 / boss　密碼 1234</p>
    </form>
  </main>
</template>
