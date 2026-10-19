import type { ReactNode } from 'react'

export function PageIntro({ kicker, title, children, aside }: { kicker?: ReactNode; title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <header className={`page-intro ${aside ? 'page-intro--aside' : ''}`}>
      <div className="container page-intro__inner">
        <div className="page-intro__text">
          {kicker && <p className="kicker">{kicker}</p>}
          <h1>{title}</h1>
          {children && <div className="page-intro__lede">{children}</div>}
        </div>
        {aside && <div className="page-intro__aside">{aside}</div>}
      </div>
    </header>
  )
}
