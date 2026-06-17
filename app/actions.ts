'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { countRooms, refreshmentTotal } from '@/lib/calculations'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function createRequest(formData: FormData) {
  const roomList = String(formData.get('room_list') || '')
  const lunchRequired = formData.get('lunch_required') === 'on'
  const lunchCost = Number(formData.get('lunch_cost') || 0)

  const payload = {
    request_date: String(formData.get('request_date') || ''),
    requestor_name: String(formData.get('requestor_name') || '').trim(),
    wbs_code: String(formData.get('wbs_code') || '').trim(),
    room_list: roomList.trim(),
    room_count: countRooms(roomList),
    refreshment_total: refreshmentTotal(roomList),
    lunch_required: lunchRequired,
    lunch_details: String(formData.get('lunch_details') || '').trim() || null,
    lunch_cost: lunchRequired ? lunchCost : 0,
    notes: String(formData.get('notes') || '').trim() || null,
    status: 'Submitted'
  }

  if (!payload.request_date || !payload.requestor_name || !payload.wbs_code || !payload.room_list) {
    throw new Error('Date, requestor, WBS/cost centre and room list are required.')
  }

  const { error } = await getSupabase().from('gmc_requests').insert(payload)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/queue')
  redirect('/queue')
}

export async function updateStatus(formData: FormData) {
  const id = String(formData.get('id'))
  const status = String(formData.get('status'))
  const approvedBy = String(formData.get('approved_by') || '').trim() || null

  const updates: Record<string, any> = { status }
  if (status === 'Approved') {
    updates.approved_by = approvedBy || 'Hospitality Manager / Supervisor'
    updates.approved_at = new Date().toISOString()
  }

  const { error } = await getSupabase().from('gmc_requests').update(updates).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/queue')
  revalidatePath('/reports')
}
