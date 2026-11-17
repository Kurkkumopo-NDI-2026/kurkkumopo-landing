import type { CSSProperties } from 'react'

const silk = "'Silkscreen',monospace"

export const silkLabel = (size: number, spacing = '.14em'): CSSProperties => ({
  fontFamily: silk,
  fontSize: size,
  letterSpacing: spacing,
  color: 'var(--accent-ink)',
})
