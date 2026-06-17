import './globals.css'
import Link from 'next/link'

export const metadata = { title: 'GMC Tracker V1' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          <div className="nav">
            <Link href="/">Dashboard</Link>
            <Link href="/new-request">New Request</Link>
            <Link href="/queue">Hospitality Queue</Link>
            <Link href="/reports">Reports</Link>
          </div>
          {children}
        </main>
      </body>
    </html>
  )
}
