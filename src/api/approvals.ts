import type { Approval } from '../types'
import { updateCustomerStaff } from './customers'

const KEY = 'crm.approvals'

const SEED: Approval[] = [
  {
    id: 1,
    type: 'reassign',
    customerName: '客戶 01',
    staffId: 1,
    status: 'pending',
    submittedAt: '2026-09-10',
    note: '原業務離職，申請改掛。',
    payload: { newStaffId: 2 },
  },
  {
    id: 2,
    type: 'phone',
    customerName: '客戶 04',
    staffId: 1,
    status: 'pending',
    submittedAt: '2026-09-12',
    note: '客戶來電更正市話。',
    payload: { oldPhone: '07-1234567', newPhone: '07-7654321' },
  },
  {
    id: 3,
    type: 'address',
    customerName: '客戶 07',
    staffId: 1,
    status: 'pending',
    submittedAt: '2026-09-14',
    note: '發票地址變更。',
    payload: { oldAddress: '高雄市鼓山區', newAddress: '高雄市前鎮區成功二路25號' },
  },
  {
    id: 4,
    type: 'credit',
    customerName: '客戶 02',
    staffId: 2,
    status: 'pending',
    submittedAt: '2026-09-15',
    note: '本季出貨增加，申請提高額度。',
    payload: { oldCredit: 100000, newCredit: 180000 },
  },
]

function load(): Approval[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(SEED))
    return SEED.map((a) => ({ ...a, payload: { ...a.payload } }))
  }
  return JSON.parse(raw) as Approval[]
}

function save(list: Approval[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

const delay = (ms = 160) => new Promise((r) => setTimeout(r, ms))

export async function getApprovals(): Promise<Approval[]> {
  await delay()
  return load().filter((a) => a.status === 'pending')
}

export async function getApprovalById(id: number): Promise<Approval | undefined> {
  await delay()
  return load().find((a) => a.id === id)
}

export async function getMyRequests(staffId: number): Promise<Approval[]> {
  await delay()
  return load().filter((a) => a.staffId === staffId)
}

export async function submitApproval(input: {
  type: Approval['type']
  customerName: string
  staffId: number
  note: string
  payload: Approval['payload']
}): Promise<void> {
  await delay()
  const list = load()
  const nextId = Math.max(0, ...list.map((a) => a.id)) + 1
  list.push({
    id: nextId,
    type: input.type,
    customerName: input.customerName,
    staffId: input.staffId,
    status: 'pending',
    submittedAt: new Date().toISOString().slice(0, 10),
    note: input.note,
    payload: input.payload,
  })
  save(list)
}

export async function decideApproval(
  id: number,
  decision: 'approved' | 'rejected',
  newStaffId?: number,
  rejectReason?: string,
): Promise<void> {
  await delay()
  const list = load()
  const target = list.find((a) => a.id === id)
  if (!target || target.status !== 'pending') return
  target.status = decision
  if (decision === 'rejected') target.rejectReason = rejectReason
  if (decision === 'approved' && target.type === 'reassign') {
    await updateCustomerStaff(target.customerName, newStaffId ?? target.payload.newStaffId ?? target.staffId)
  }
  save(list)
}
