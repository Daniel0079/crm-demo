import type { Customer, PagedResult } from '../types'

const KEY = 'crm.customers'

const SEED: Customer[] = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  name: `客戶 ${String(i + 1).padStart(2, '0')}`,
  staffId: (i % 3) + 1,
}))

function load(): Customer[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(SEED))
    return SEED.map((c) => ({ ...c }))
  }
  return JSON.parse(raw) as Customer[]
}

function save(list: Customer[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms))

export async function getCustomers(params: {
  keyword: string
  page: number
  pageSize: number
  staffId: number | null
}): Promise<PagedResult> {
  await delay()
  let list = load()
  if (params.staffId != null) list = list.filter((c) => c.staffId === params.staffId)
  const kw = params.keyword.trim()
  if (kw) list = list.filter((c) => c.name.includes(kw))
  const start = (params.page - 1) * params.pageSize
  return { rows: list.slice(start, start + params.pageSize), total: list.length }
}

export async function updateCustomerStaff(customerName: string, newStaffId: number) {
  await delay(60)
  const list = load()
  const row = list.find((c) => c.name === customerName)
  if (row) row.staffId = newStaffId
  save(list)
}
