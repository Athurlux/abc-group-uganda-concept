import { Link } from 'react-router'
import { COLLECTIONS } from '../data/collections'
import { SHOWROOMS } from '../data/locations'
import { CHECKED_ON, COMPANY_EMAIL, PORTFOLIO_URL, SOURCES } from '../data/site'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <span className="site-footer__logo"><Logo height={40} /></span>
          <p>Tiles, sanitaryware, panels, sinks and installation materials, with showrooms across Kampala.</p>
          <p><a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a></p>
        </div>
        <nav aria-label="Collections" className="site-footer__col">
          <h2>Collections</h2>
          <ul>{COLLECTIONS.map(collection => <li key={collection.slug}><Link to={`/collections/${collection.slug}`}>{collection.name}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Showrooms" className="site-footer__col">
          <h2>Showrooms</h2>
          <ul>
            {SHOWROOMS.map(showroom => <li key={showroom.slug}><Link to={`/showrooms/${showroom.slug}`}>{showroom.name}</Link></li>)}
            <li><Link to="/showrooms/visit">Plan a visit</Link></li>
          </ul>
        </nav>
        <nav aria-label="More" className="site-footer__col">
          <h2>Plan your project</h2>
          <ul>
            <li><Link to="/shortlist">Project shortlist</Link></li>
            <li><Link to="/quote">Request a quote</Link></li>
            <li><Link to="/inspiration">Inspiration</Link></li>
            <li><Link to="/professionals">For professionals</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
      <div className="container site-footer__disclosure">
        <p>
          This independent website concept was created to demonstrate a proposed digital experience for ABC Group Uganda. It is not
          ABC’s website and was not commissioned or approved by ABC. Forms are demonstrations and send nothing. Interior scenes and
          textures are AI-generated inspiration, not ABC projects or stocked products. Company details were taken from{' '}
          <a href={SOURCES.home} rel="noopener">abcgroupuganda.com</a> on {CHECKED_ON}.
        </p>
        <p className="site-footer__credit">Concept design &amp; development by <a href={PORTFOLIO_URL} rel="noopener">Arthur Kitandwe</a>.</p>
      </div>
    </footer>
  )
}
