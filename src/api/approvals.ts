import type { Approval } from '../types'
import { updateCustomerStaff } from './customers'

const ALL: Approval[] = [
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

let nextId = 5
const delay = (ms = 160) => new Promise((r) => setTimeout(r, ms))

export async function getApprovals(): Promise<Approval[]> {
  await delay()
  return ALL.filter((a) => a.status === 'pending')
}

export async function getApprovalById(id: number): Promise<Approval | undefined> {
  await delay()
  return ALL.find((a) => a.id === id)
}

export async function getMyRequests(staffId: number): Promise<Approval[]> {
  await delay()
  return ALL.filter((a) => a.staffId === staffId)
}

export async function submitApproval(input: {
  type: Approval['type']
  customerName: string
  staffId: number
  note: string
  payload: Approval['payload']
}): Promise<void> {
  await delay()
  ALL.push({
    id: nextId++,
    type: input.type,
    customerName: input.customerName,
    staffId: input.staffId,
    status: 'pending',
    submittedAt: new Date().toISOString().slice(0, 10),
    note: input.note,
    payload: input.payload,
  })
}

export async function decideApproval(
  id: number,
  decision: 'approved' | 'rejected',
  newStaffId?: number,
  rejectReason?: string,
): Promise<void> {
  await delay()
  const target = ALL.find((a) => a.id === id)
  if (!target || target.status !== 'pending') return
  target.status = decision
  if (decision === 'rejected') target.rejectReason = rejectReason
  if (decision === 'approved' && target.type === 'reassign') {
    await updateCustomerStaff(target.customerName, newStaffId ?? target.payload.newStaffId ?? target.staffId)
  }
}
