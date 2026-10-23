export interface Customer {
  id: number
  name: string
  staffId: number
}

export interface PagedResult {
  rows: Customer[]
  total: number
}

export type ApprovalType = 'reassign' | 'phone' | 'address' | 'credit'

export interface Approval {
  id: number
  type: ApprovalType
  customerName: string
  staffId: number
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  note: string
  rejectReason?: string
  payload: {
    newStaffId?: number
    oldPhone?: string
    newPhone?: string
    oldAddress?: string
    newAddress?: string
    oldCredit?: number
    newCredit?: number
  }
}

export const APPROVAL_LABEL: Record<ApprovalType, string> = {
  reassign: '改掛負責人',
  phone: '改電話',
  address: '改地址',
  credit: '調額度',
}

export const STAFF_LABEL: Record<number, string> = {
  1: '員工一 staff1',
  2: '員工二 staff2',
  3: '員工三 staff3',
}
