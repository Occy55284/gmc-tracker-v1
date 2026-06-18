import { createRequest } from '@/app/actions'

export default function NewRequestPage() {
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>New GMC Request</h1>
          <p className="lead">Submit a room refreshment request to the hospitality team.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        <form action={createRequest}>
          <label>Date</label>
          <input type="date" name="request_date" defaultValue={today} required />

          <label>Requestor Name</label>
          <input name="requestor_name" placeholder="Customer Service name" required />

          <label>Room List — one room per line</label>
          <textarea name="room_list" placeholder={`3.05\n3.07\n4.06`} required />
          <p className="hint">Each room is charged at the standard refreshment setup rate of £3.99.</p>

          <label className="check"><input type="checkbox" name="lunch_required" /> Lunch required?</label>

          <label>Lunch Details</label>
          <textarea name="lunch_details" placeholder="Example: 6 x wraps, 2 x salads" />

          <label>Time of Lunch</label>
          <input type="time" name="lunch_time" />

          <label>Lunch Cost</label>
          <input type="number" step="0.01" min="0" name="lunch_cost" placeholder="0.00" />

          <label>Notes</label>
          <textarea name="notes" placeholder="Optional notes" />

          <button type="submit" className="btn-block">Submit to Hospitality</button>
        </form>
      </div>
    </>
  )
}
