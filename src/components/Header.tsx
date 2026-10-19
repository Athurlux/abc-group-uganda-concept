import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useFocusTrap, useScrollLock } from '../lib/useFocusTrap'
import { useShortlist } from '../lib/shortlist'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { ClearShortlist, EmptyShortlist, ShortlistList } from './ShortlistControls'

export const NAV = [
  { to: '/collections', label: 'Collections' },
  { to: '/inspiration', label: 'Inspiration' },
  { to: '/showrooms', label: 'Showrooms' },
  { to: '/professionals', label: 'For professionals' },
  { to: '/about', label: 'About' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const count = useShortlist().items.length
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  useFocusTrap(headerRef, menuOpen, closeMenu)
  useFocusTrap(drawerRef, drawerOpen, closeDrawer)
  useScrollLock(menuOpen || drawerOpen)
  useEffect(() => { setMenuOpen(false); setDrawerOpen(false) }, [pathname])

  return (
    <>
      <header className={`site-header ${menuOpen ? 'is-menu' : ''}`}>
        <div ref={headerRef} className="site-header__bar">
          <div className="container site-header__inner">
            <div className="site-header__brand">
              <Link to="/" className="site-header__logo" aria-label="ABC Group Uganda concept, home"><Logo /></Link>
              <Link to="/about#concept" className="concept-tag">Independent redesign concept</Link>
            </div>

            <nav className="site-nav" aria-label="Main">
              <ul>{NAV.map(link => <li key={link.to}><NavLink to={link.to}>{link.label}</NavLink></li>)}</ul>
            </nav>

            <div className="site-header__actions">
              <button type="button" className="shortlist-toggle" aria-haspopup="dialog" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)} aria-label={`Project shortlist, ${count} ${count === 1 ? 'selection' : 'selections'}`}>
                <Icon name="shortlist" size={20} />
                <span className="shortlist-toggle__label">Shortlist</span>
                {/* Keyed by count so the badge replays its short pop on every change. */}
                <span key={count} className={`count ${count ? 'is-filled' : ''}`} aria-hidden="true">{count}</span>
              </button>
              <button type="button" className="menu-button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(open => !open)}>
                <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
              </button>
            </div>
          </div>

          <div id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
            <nav aria-label="Mobile">
              <ul className="mobile-menu__primary">
                <li><NavLink to="/" end data-autofocus>Home</NavLink></li>
                {NAV.map(link => <li key={link.to}><NavLink to={link.to}>{link.label}</NavLink></li>)}
                <li><NavLink to="/shortlist">Project shortlist ({count})</NavLink></li>
              </ul>
              <ul className="mobile-menu__secondary">
                <li><Link to="/showrooms/visit">Plan a showroom visit</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </nav>
            <Link to="/quote" className="button button--primary button--block">Request a quote</Link>
          </div>
        </div>
      </header>

      {/* Rendered only while open, so the page never holds a second, hidden copy of the list. */}
      {drawerOpen && (
      <div className="drawer">
        <button type="button" className="drawer__scrim" tabIndex={-1} aria-hidden="true" onClick={closeDrawer} />
        <div ref={drawerRef} className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <div className="drawer__head">
            <h2 id="drawer-title">Project shortlist</h2>
            <button type="button" className="icon-button" aria-label="Close shortlist" onClick={closeDrawer} data-autofocus><Icon name="close" size={20} /></button>
          </div>
          {count ? (
            <>
              <div className="drawer__body"><ShortlistList compact onNavigate={closeDrawer} /></div>
              <div className="drawer__foot">
                <Link to="/quote" className="button button--primary button--block" onClick={closeDrawer}>Request a quote</Link>
                <div className="drawer__links">
                  <Link to="/shortlist" onClick={closeDrawer}>Open full shortlist</Link>
                  <ClearShortlist />
                </div>
              </div>
            </>
          ) : (
            <div className="drawer__body"><EmptyShortlist /></div>
          )}
        </div>
      </div>
      )}
    </>
  )
}
