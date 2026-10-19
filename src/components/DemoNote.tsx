import type { ReactNode } from 'react'

/** A short note kept beside each form, so nobody mistakes a demo for a real enquiry. */
export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <aside className="demo-note" aria-label="About this form">
      <p className="demo-note__title">Demonstration form</p>
      <p>{children}</p>
    </aside>
  )
}
