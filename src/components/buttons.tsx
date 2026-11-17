import type { ReactNode } from 'react'

export function PrimaryBtn({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="kh5"
      style={{
        padding: '16px 24px',
        background: 'var(--accent)',
        color: 'var(--on-accent)',
        fontWeight: 600,
        fontSize: 15,
        textDecoration: 'none',
        transition: 'background .15s,transform .15s',
      }}
    >
      {children}
    </a>
  )
}

export function SecondaryBtn({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="kh6"
      style={{
        padding: '16px 24px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        fontWeight: 600,
        fontSize: 15,
        textDecoration: 'none',
        transition: 'border-color .15s,transform .15s',
      }}
    >
      {children}
    </a>
  )
}
