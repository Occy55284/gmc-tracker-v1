import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { money, formatDateWithDay } from '@/lib/calculations'
import StatusBadge from './components/StatusBadge'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const { data: requests } = await supabase
    .from('gmc_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15)

  const rows = requests || []
  const rooms = rows.reduce((sum, r) => sum + Number(r.room_count || 0), 0)
  const refreshments = rows.reduce((sum, r) => sum + Number(r.refreshment_total || 0), 0)
  const lunches = rows.reduce((sum, r) => sum + Number(r.lunch_cost || 0), 0)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="lead">Room refreshment capture, lunch costs, delivery status and approval reporting.</p>
        </div>
        <Link href="/new-request" className="btn">+ New Request</Link>
      </div>

      <div className="grid stats">
        <div className="stat stat-indigo">
          <span className="stat-icon">📋</span>
          <span className="stat-label">Recent requests</span>
          <span className="stat-value">{rows.length}</span>
        </div>
        <div className="stat stat-cyan">
          <span className="stat-icon">🚪</span>
          <span className="stat-label">Rooms serviced</span>
          <span className="stat-value">{rooms}</span>
        </div>
        <div className="stat stat-amber">
          <span className="stat-icon">☕</span>
          <span className="stat-label">Refreshments</span>
          <span className="stat-value">{money(refreshments)}</span>
        </div>
        <div className="stat stat-emerald">
          <span className="stat-icon">💷</span>
          <span className="stat-label">Total revenue</span>
          <span className="stat-value">{money(refreshments + lunches)}</span>
        </div>
      </div>

      <div className="card">
        <h2>Recent Requests</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Requestor</th><th>Rooms</th><th>Status</th><th>Approved By</th><th>Total</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="row-link">
                  <td><Link href={`/requests/${r.id}`}>{formatDateWithDay(r.request_date)}</Link></td>
                  <td><Link href={`/requests/${r.id}`}>{r.requestor_name}</Link></td>
                  <td>{r.room_count}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{r.approved_by || '—'}</td>
                  <td>{money(r.total_cost)}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={6} className="empty">No requests yet. <Link href="/new-request">Create the first request</Link>.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
