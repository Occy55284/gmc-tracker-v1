'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/new-request', label: 'New Request' },
  { href: '/queue', label: 'Hospitality Queue' },
  { href: '/reports', label: 'Reports' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="nav">
      {links.map((l) => {
        const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
        return (
          <Link key={l.href} href={l.href} className={active ? 'nav-link active' : 'nav-link'}>
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
