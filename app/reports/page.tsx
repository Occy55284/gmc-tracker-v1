import { supabase } from '@/lib/supabase'
import { money } from '@/lib/calculations'

export const dynamic = 'force-dynamic'

function startOfWeek(date = new Date()) {
  const d = new Date(date)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d.toISOString().slice(0, 10)
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10)
}

function summarise(rows: any[]) {
  const requests = rows.length
  const rooms = rows.reduce((sum, r) => sum + Number(r.room_count || 0), 0)
  const refreshments = rows.reduce((sum, r) => sum + Number(r.refreshment_total || 0), 0)
  const lunches = rows.reduce((sum, r) => sum + Number(r.lunch_cost || 0), 0)
  return { requests, rooms, refreshments, lunches, total: refreshments + lunches }
}

export default async function ReportsPage() {
  const week = startOfWeek()
  const month = startOfMonth()

  const { data: weekRows } = await supabase
    .from('gmc_requests')
    .select('*')
    .eq('status', 'Approved')
    .gte('request_date', week)

  const { data: monthRows } = await supabase
    .from('gmc_requests')
    .select('*')
    .eq('status', 'Approved')
    .gte('request_date', month)

  const weekly = summarise(weekRows || [])
  const monthly = summarise(monthRows || [])

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Reports</h1>
          <p className="lead">Approved records only — ready for weekly and monthly billing.</p>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>This Week</h2>
          <table className="kv"><tbody>
            <tr><th>Requests</th><td>{weekly.requests}</td></tr>
            <tr><th>Rooms serviced</th><td>{weekly.rooms}</td></tr>
            <tr><th>Refreshment revenue</th><td>{money(weekly.refreshments)}</td></tr>
            <tr><th>Lunch revenue</th><td>{money(weekly.lunches)}</td></tr>
            <tr><th>Total revenue</th><td>{money(weekly.total)}</td></tr>
          </tbody></table>
        </div>
        <div className="card">
          <h2>This Month</h2>
          <table className="kv"><tbody>
            <tr><th>Requests</th><td>{monthly.requests}</td></tr>
            <tr><th>Rooms serviced</th><td>{monthly.rooms}</td></tr>
            <tr><th>Refreshment revenue</th><td>{money(monthly.refreshments)}</td></tr>
            <tr><th>Lunch revenue</th><td>{money(monthly.lunches)}</td></tr>
            <tr><th>Total revenue</th><td>{money(monthly.total)}</td></tr>
          </tbody></table>
        </div>
      </div>

      <div className="card">
        <h2>Export</h2>
        <p>V1 stores all approved records in Supabase. The first export option can be added next as either CSV download or Excel export.</p>
      </div>
    </>
  )
}
