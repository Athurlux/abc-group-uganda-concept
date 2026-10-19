import { Link } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/** Also used for unknown collections, items, rooms and showrooms reached by a stale link. */
export default function NotFound({ what }: { what?: string }) {
  useDocumentTitle(what ? `${what[0].toUpperCase()}${what.slice(1)} not found` : 'Page not found')
  return (
    <section className="container not-found">
      <h1>{what ? `We couldn’t find that ${what}.` : 'This page isn’t here.'}</h1>
      <p className="lede">The link may be mistyped or out of date. These are the main ways through the site.</p>
      <ul className="not-found__routes">
        <li><Link to="/collections">Collections</Link><span>Browse and search every pictured selection</span></li>
        <li><Link to="/shortlist">Project shortlist</Link><span>Your saved selections, kept on this device</span></li>
        <li><Link to="/showrooms">Showrooms</Link><span>Addresses and published phone numbers</span></li>
        <li><Link to="/contact">Contact</Link><span>Published contact details for ABC</span></li>
      </ul>
      <Link to="/" className="button button--primary">Go to the homepage</Link>
    </section>
  )
}
