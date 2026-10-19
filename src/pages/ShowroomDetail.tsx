import { Link, useParams } from 'react-router'
import { announce } from '../components/Announcer'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Icon } from '../components/Icon'
import { RefImg } from '../components/Img'
import { SHOWROOMS, directionsUrl, findShowroom } from '../data/locations'
import { CHECKED_ON, COMPANY_EMAIL, SOURCES } from '../data/site'
import { shortlist, useShortlist } from '../lib/shortlist'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import NotFound from './NotFound'

export default function ShowroomDetail() {
  const { slug } = useParams()
  const showroom = findShowroom(slug)
  const preferred = useShortlist().showroom
  useDocumentTitle(showroom?.name ?? 'Showroom not found')
  if (!showroom) return <NotFound what="showroom" />
  const isPreferred = preferred === showroom.slug

  return (
    <article className="container showroom">
      <Breadcrumbs trail={[{ label: 'Showrooms', to: '/showrooms' }, { label: showroom.name }]} />
      <div className="showroom__grid">
        <div>
          <h1>{showroom.name}</h1>
          <dl className="facts facts--plain">
            <div><dt>Address</dt><dd>{showroom.address}</dd></div>
            <div><dt>Phone</dt><dd><a href={`tel:${showroom.phone}`}>{showroom.phoneDisplay}</a></dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> (shared by all locations)</dd></div>
            <div><dt>Opening hours</dt><dd>Not published. Call before visiting.</dd></div>
            <div><dt>On display</dt><dd>ABC doesn’t publish what each showroom displays. Ask by phone, or note it in a visit request.</dd></div>
          </dl>
          <p className="source-note">From <a href={SOURCES.about} rel="noopener">ABC’s About page</a>, checked {CHECKED_ON}.</p>
          <div className="button-row">
            <Link to={`/showrooms/visit?showroom=${showroom.slug}`} className="button button--primary">Plan a visit here</Link>
            <a href={directionsUrl(showroom)} rel="noopener" target="_blank" className="button button--outline"><Icon name="pin" size={18} /> Directions<span className="visually-hidden"> (opens Google Maps)</span></a>
          </div>
          <button
            type="button"
            className="text-button"
            aria-pressed={isPreferred}
            onClick={() => {
              shortlist.setShowroom(isPreferred ? null : showroom.slug)
              announce(isPreferred ? 'Preferred showroom cleared' : `${showroom.name} set as your preferred showroom`)
            }}
          >
            {isPreferred ? 'Preferred showroom (clear)' : 'Use as my preferred showroom'}
          </button>
          <p className="fine-print">Your preferred showroom fills in automatically on quote and visit requests.</p>
        </div>
        <figure className="showroom__photo">
          {showroom.photo ? (
            <>
              <RefImg image={showroom.photo} width={1000} height={800} alt={showroom.photoAlt} sizes="(min-width: 1024px) 50vw, 100vw" priority />
              <figcaption>Photo as published on ABC’s website. Any promotional signage it shows is historical, not a current offer.</figcaption>
            </>
          ) : (
            <span className="photo-none photo-none--large"><Icon name="showroom" size={40} /><span>ABC hasn’t published a photo of this showroom.</span></span>
          )}
        </figure>
      </div>

      <section className="section section--tight" aria-labelledby="other-showrooms">
        <h2 className="section-title" id="other-showrooms">Other showrooms</h2>
        <ul className="link-stack link-stack--row">
          {SHOWROOMS.filter(other => other.slug !== showroom.slug).map(other => <li key={other.slug}><Link to={`/showrooms/${other.slug}`}>{other.name}</Link></li>)}
        </ul>
      </section>
    </article>
  )
}
