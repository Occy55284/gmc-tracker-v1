import { supabase } from '@/lib/supabase'
import { money } from '@/lib/calculations'
import { updateStatus } from '@/app/actions'
import StatusBadge from '@/app/components/StatusBadge'

function submittedAt(value: string) {
  return new Date(value).toLocaleString('en-GB', { timeZone: 'Europe/London' })
}

export default async function QueuePage() {
  const { data } = await supabase
    .from('gmc_requests')
    .select('*')
    .neq('status', 'Approved')
    .order('request_date', { ascending: true })
    .order('created_at', { ascending: true })

  const rows = data || []

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Hospitality Queue</h1>
          <p className="lead">Mark requests as delivered, then approve them for reporting.</p>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Requestor</th><th>Rooms</th><th>Lunch</th><th>Total</th><th>Submitted</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.request_date}</td>
                  <td>{r.requestor_name}</td>
                  <td><pre>{r.room_list}</pre><strong>{r.room_count} rooms</strong></td>
                  <td>{r.lunch_required ? <><div>{r.lunch_details}{r.lunch_time ? ` at ${r.lunch_time}` : ''}</div><strong>{money(r.lunch_cost)}</strong></> : 'No'}</td>
                  <td>{money(r.total_cost)}</td>
                  <td>{submittedAt(r.created_at)}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div className="actions">
                      {r.status === 'Submitted' && (
                        <form action={updateStatus}>
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="status" value="Delivered" />
                          <button className="secondary" type="submit">Mark Delivered</button>
                        </form>
                      )}
                      {r.status === 'Delivered' && (
                        <form action={updateStatus} className="actions">
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="status" value="Approved" />
                          <input name="approved_by" placeholder="Approved by" />
                          <button className="success" type="submit">Approve</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={8} className="empty">No active requests.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
