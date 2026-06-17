import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { money } from '@/lib/calculations'

export default async function Dashboard() {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7))

  const { data: requests } = await supabase
    .from('gmc_requests')
    .select('*')
    .gte('request_date', weekStart.toISOString().slice(0, 10))
    .order('request_date', { ascending: false })
    .limit(10)

  const rows = requests || []
  const rooms = rows.reduce((sum, r) => sum + Number(r.room_count || 0), 0)
  const refreshments = rows.reduce((sum, r) => sum + Number(r.refreshment_total || 0), 0)
  const lunches = rows.reduce((sum, r) => sum + Number(r.lunch_cost || 0), 0)

  return (
    <>
      <h1>GMC Tracker</h1>
      <p>Version 1: room refreshment capture, lunch costs, delivery status and approval reporting.</p>

      <div className="grid">
        <div className="card"><strong>This week requests</strong><h2>{rows.length}</h2></div>
        <div className="card"><strong>Rooms serviced</strong><h2>{rooms}</h2></div>
        <div className="card"><strong>Refreshments</strong><h2>{money(refreshments)}</h2></div>
        <div className="card"><strong>Total revenue</strong><h2>{money(refreshments + lunches)}</h2></div>
      </div>

      <div className="card">
        <h2>Recent Requests</h2>
        <table>
          <thead><tr><th>Date</th><th>Requestor</th><th>Rooms</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.request_date}</td>
                <td>{r.requestor_name}</td>
                <td>{r.room_count}</td>
                <td><span className="badge">{r.status}</span></td>
                <td>{money(r.total_cost)}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={5}>No requests yet. <Link href="/new-request">Create the first request</Link>.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
