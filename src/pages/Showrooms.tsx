import { Link } from 'react-router'
import { Icon } from '../components/Icon'
import { RefImg } from '../components/Img'
import { PageIntro } from '../components/PageIntro'
import { LOCATIONS, SHOWROOMS, directionsUrl } from '../data/locations'
import { CHECKED_ON, SOURCES } from '../data/site'
import { useShortlist } from '../lib/shortlist'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Showrooms() {
  useDocumentTitle('Showrooms')
  const preferred = useShortlist().showroom
  const warehouse = LOCATIONS.find(location => location.kind === 'warehouse')!

  return (
    <>
      <PageIntro kicker="Showrooms" title="Four showrooms across Kampala">
        <p>Addresses and phone numbers as published on <a href={SOURCES.about} rel="noopener">ABC’s About page</a>, checked {CHECKED_ON}. Opening hours are not published, so call before you travel.</p>
        <p className="fine-print">Photos are as published on ABC’s website. Any sale signage in them is historical, not a current offer.</p>
      </PageIntro>

      <section className="container section section--tight" aria-label="Showrooms">
        <ul className="showroom-cards">
          {SHOWROOMS.map(showroom => (
            <li key={showroom.slug} className="showroom-card">
              <div className="showroom-card__photo">
                {showroom.photo
                  ? <RefImg image={showroom.photo} width={1000} height={800} alt={showroom.photoAlt} sizes="(min-width: 1024px) 45vw, 100vw" />
                  : <span className="photo-none"><Icon name="showroom" size={32} /><span>No published photo of this showroom</span></span>}
              </div>
              <div className="showroom-card__text">
                <h2><Link to={`/showrooms/${showroom.slug}`}>{showroom.name}</Link>{preferred === showroom.slug && <span className="tag">Your preferred showroom</span>}</h2>
                <p className="showroom-card__address"><Icon name="pin" size={18} /> {showroom.address}</p>
                <p><Icon name="phone" size={18} /> <a href={`tel:${showroom.phone}`}>{showroom.phoneDisplay}</a></p>
                <div className="button-row">
                  <Link to={`/showrooms/${showroom.slug}`} className="button button--outline button--small">Showroom details</Link>
                  <Link to={`/showrooms/visit?showroom=${showroom.slug}`} className="button button--primary button--small">Plan a visit</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="container section section--tight" aria-labelledby="warehouse-title">
        <div className="warehouse">
          <h2 id="warehouse-title">{warehouse.name}</h2>
          <p>{warehouse.address}. Phone <a href={`tel:${warehouse.phone}`}>{warehouse.phoneDisplay}</a>.</p>
          <p>ABC lists this as its warehouse, not a showroom. Visitor access isn’t published, so it isn’t offered for visit requests here.</p>
          <a href={directionsUrl(warehouse)} rel="noopener" target="_blank" className="text-link">Directions (opens Google Maps)</a>
        </div>
      </section>
    </>
  )
}
