import type { ReactNode } from 'react'

export function PrimaryBtn({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="kh5"
      style={{
        padding: '16px 24px',
        background: '#f5b81c',
        color: '#070c18',
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
        background: '#0b1224',
        border: '1px solid #1c2740',
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
