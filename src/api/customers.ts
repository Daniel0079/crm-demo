import type { Customer, PagedResult } from '../types'

const ALL: Customer[] = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  name: `客戶 ${String(i + 1).padStart(2, '0')}`,
  staffId: (i % 3) + 1,
}))

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms))

export async function getCustomers(params: {
  keyword: string
  page: number
  pageSize: number
  staffId: number | null
}): Promise<PagedResult> {
  await delay()
  let list = ALL
  if (params.staffId != null) list = list.filter((c) => c.staffId === params.staffId)
  const kw = params.keyword.trim()
  if (kw) list = list.filter((c) => c.name.includes(kw))
  const start = (params.page - 1) * params.pageSize
  return { rows: list.slice(start, start + params.pageSize), total: list.length }
}

export async function updateCustomerStaff(customerName: string, newStaffId: number) {
  await delay(60)
  const row = ALL.find((c) => c.name === customerName)
  if (row) row.staffId = newStaffId
}
