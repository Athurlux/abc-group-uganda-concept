import { Link } from 'react-router'
import { RefImg } from '../components/Img'
import { PageIntro } from '../components/PageIntro'
import { COLLECTIONS } from '../data/collections'
import { LOCATIONS } from '../data/locations'
import { CHECKED_ON, NAMED_PROJECTS, PORTFOLIO_URL, SOURCES } from '../data/site'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function About() {
  useDocumentTitle('About')
  return (
    <>
      <PageIntro
        kicker="About"
        title="A materials supplier with showrooms across Kampala"
        aside={<figure className="intro-figure"><RefImg image="about-us-02" width={1000} height={800} alt="The ABC Hauz building in Industrial Area, as published on ABC’s website." sizes="(min-width: 1024px) 36vw, 100vw" priority /></figure>}
      >
        <p>
          ABC Group Uganda supplies tiles, sanitaryware, bathroom fittings, wall panels, kitchen sinks and installation materials
          to homeowners, architects and construction professionals. Its website lists {LOCATIONS.length - 1} showrooms and a warehouse in Kampala.
        </p>
      </PageIntro>

      <section className="container section section--tight about">
        <div className="about__grid">
          <section aria-labelledby="range-title">
            <h2 className="section-title" id="range-title">What it supplies</h2>
            <ul className="link-stack">{COLLECTIONS.map(collection => <li key={collection.slug}><Link to={`/collections/${collection.slug}`}>{collection.name}</Link></li>)}</ul>
          </section>
          <section aria-labelledby="projects-title">
            <h2 className="section-title" id="projects-title">Projects named on ABC’s website</h2>
            <p>ABC’s homepage lists projects including:</p>
            <ul className="project-names">{NAMED_PROJECTS.map(name => <li key={name}>{name}</li>)}</ul>
            <p className="fine-print">The site doesn’t say what ABC supplied to each, so no role or imagery is attached to these names here. An official version would confirm each project’s scope first.</p>
          </section>
        </div>

        <section className="concept-box" id="concept" aria-labelledby="concept-title" tabIndex={-1}>
          <h2 className="section-title" id="concept-title">About this concept</h2>
          <p>
            This independent website concept was created to demonstrate a proposed digital experience for ABC Group Uganda. It is not
            ABC’s website, and ABC did not commission or approve it. The official site is <a href={SOURCES.home} rel="noopener">abcgroupuganda.com</a>.
          </p>
          <ul className="check-list">
            <li>The logo is ABC’s own published logo, used unchanged. The colours, layout and the line “Materials that make the space” are proposals.</li>
            <li>Product and showroom photographs come from ABC’s website. Product names describe what each photo shows; brand, size, price and availability are left to be confirmed.</li>
            <li>Interior scenes and textures are AI-generated inspiration. They are not ABC projects, client rooms or stocked products.</li>
            <li>Every form is a demonstration. Nothing is sent, booked or quoted. Only your shortlist (item IDs and piece counts) and preferred showroom are saved on this device.</li>
            <li>Company details were checked against ABC’s website on {CHECKED_ON}. ABC’s site gives both 1998 and 2015 as starting points, so no founding year is stated here.</li>
          </ul>
          <p>Concept design &amp; development by <a href={PORTFOLIO_URL} rel="noopener">Arthur Kitandwe</a>.</p>
        </section>
      </section>
    </>
  )
}
