<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCustomers } from '../api/customers'
import { usePendingApprovals } from '../composables/usePendingApprovals'
import { useSession } from '../composables/useSession'
import { STAFF_LABEL, type ApprovalType, type Customer } from '../types'

const router = useRouter()
const { staffId } = useSession()
const { submit } = usePendingApprovals()

const type = ref<ApprovalType>('reassign')
const keyword = ref('')
const selected = ref<Customer | null>(null)
const options = ref<Customer[]>([])
const open = ref(false)
const note = ref('')
const newStaffId = ref(2)
const newPhone = ref('')
const newAddress = ref('')
const newCredit = ref(100000)
const error = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

const staffOptions = computed(() =>
  Object.entries(STAFF_LABEL)
    .map(([id, label]) => ({ id: Number(id), label }))
    .filter((row) => row.id !== staffId.value),
)

async function search() {
  const res = await getCustomers({
    keyword: keyword.value,
    page: 1,
    pageSize: 20,
    staffId: staffId.value,
  })
  options.value = res.rows
  open.value = true
}

watch(keyword, () => {
  selected.value = null
  clearTimeout(timer)
  timer = setTimeout(search, 300)
})

function pick(row: Customer) {
  selected.value = row
  keyword.value = row.name
  open.value = false
}

async function send() {
  error.value = ''
  if (!selected.value) {
    error.value = '請從下拉選一個客戶'
    return
  }
  if (!note.value.trim()) {
    error.value = '請填申請說明'
    return
  }
  if (staffId.value == null) return
  const payload =
    type.value === 'reassign'
      ? { newStaffId: Number(newStaffId.value) }
      : type.value === 'phone'
        ? { newPhone: newPhone.value }
        : type.value === 'address'
          ? { newAddress: newAddress.value }
          : { newCredit: Number(newCredit.value) }
  await submit({
    type: type.value,
    customerName: selected.value.name,
    staffId: staffId.value,
    note: note.value.trim(),
    payload,
  })
  router.push({ name: 'my-requests' })
}
</script>

<template>
  <main class="mx-auto max-w-xl space-y-4 p-6">
    <RouterLink :to="{ name: 'my-requests' }" class="text-sm text-stone-500 hover:text-amber-400">← 返回</RouterLink>
    <p class="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500">File // New Request</p>
    <h1 class="font-mono text-xl">提出申請</h1>
    <label class="block text-sm">類型
      <select v-model="type" class="mt-1 w-full border border-stone-600 bg-zinc-950 px-2 py-1">
        <option value="reassign">改掛負責人</option>
        <option value="phone">改電話</option>
        <option value="address">改地址</option>
        <option value="credit">調額度</option>
      </select>
    </label>
    <div class="relative">
      <label class="block text-sm">客戶
        <input
          v-model="keyword"
          placeholder="輸入名稱，停 300ms 篩選"
          class="mt-1 w-full border border-stone-600 bg-zinc-950 px-2 py-1"
          @focus="search"
        />
      </label>
      <ul v-if="open && options.length" class="absolute z-10 mt-1 max-h-48 w-full overflow-auto border border-stone-600 bg-zinc-900">
        <li v-for="row in options" :key="row.id">
          <button type="button" class="w-full px-2 py-1 text-left text-sm hover:bg-amber-500 hover:text-zinc-950" @click="pick(row)">
            {{ row.name }}
          </button>
        </li>
      </ul>
      <p v-if="selected" class="mt-1 text-xs text-stone-500">已選 {{ selected.name }}，負責人 {{ STAFF_LABEL[selected.staffId] }}</p>
    </div>
    <label v-if="type === 'reassign'" class="block text-sm">新負責人
      <select v-model.number="newStaffId" class="mt-1 w-full border border-stone-600 bg-zinc-950 px-2 py-1">
        <option v-for="row in staffOptions" :key="row.id" :value="row.id">{{ row.label }}</option>
      </select>
    </label>
    <label v-else-if="type === 'phone'" class="block text-sm">新電話
      <input v-model="newPhone" class="mt-1 w-full border border-stone-600 bg-zinc-950 px-2 py-1" />
    </label>
    <label v-else-if="type === 'address'" class="block text-sm">新地址
      <input v-model="newAddress" class="mt-1 w-full border border-stone-600 bg-zinc-950 px-2 py-1" />
    </label>
    <label v-else class="block text-sm">新額度
      <input v-model.number="newCredit" type="number" min="0" class="mt-1 w-40 border border-stone-600 bg-zinc-950 px-2 py-1" />
    </label>
    <label class="block text-sm">說明
      <textarea v-model="note" rows="3" class="mt-1 w-full border border-stone-600 bg-zinc-950 px-2 py-1" />
    </label>
    <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
    <button type="button" class="border border-amber-600 bg-amber-500 px-4 py-1.5 text-sm font-semibold text-zinc-950" @click="send">
      送出
    </button>
  </main>
</template>
