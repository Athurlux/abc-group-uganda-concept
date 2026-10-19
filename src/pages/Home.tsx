import { useRef } from 'react'
import { Link } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { ItemImg, RefImg, SceneImg, TextureImg } from '../components/Img'
import { AddToShortlist } from '../components/ShortlistControls'
import { CATALOGUE } from '../data/catalogue'
import { COLLECTIONS } from '../data/collections'
import { ILLUSTRATIVE_FINISH, SCENES } from '../data/inspiration'
import { SHOWROOMS } from '../data/locations'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const HEADLINE = ['Every remarkable space', 'starts with the right materials.']
const FEATURED = ['sanitaryware-02', 'kitchensinks-02', 'sanitaryware-04', 'concealed-cistern-02'].map(id => CATALOGUE.find(item => item.id === id)!)

const STEPS = [
  { title: 'Save as you browse', body: 'Add products and application ideas to one project shortlist. It stays on this device between visits.' },
  { title: 'Organise the list', body: 'Set piece counts where an item is counted in pieces. Tiles, panels and adhesives stay “quantity to confirm”, because area and pack sizes need measuring.' },
  { title: 'Send it as one enquiry', body: 'Describe the project once and share the whole list, instead of asking about items one message at a time.' },
]

export default function Home() {
  useDocumentTitle(null)
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)

  return (
    <div ref={root} className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="kicker">Tiles, sanitaryware and interior materials in Kampala</p>
          <h1 className="hero__title" id="hero-title">
            {HEADLINE.map(line => <span key={line} className="hero__line"><span data-hero="line">{line}</span></span>)}
          </h1>
          <p className="hero__lede" data-hero="lede">
            Tiles, bathroom fittings, wall panels, kitchen sinks and the adhesives that hold them in place, with four showrooms
            across Kampala where you can see them in person.
          </p>
          <div className="button-row">
            <Link to="/collections" className="button button--primary button--large">Explore collections</Link>
            <Link to="/shortlist" className="button button--outline button--large">Build your project shortlist</Link>
          </div>
        </div>
        <figure className="hero__media">
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/hero-desktop-960.webp 960w, /images/hero-desktop-1536.webp 1536w" sizes="(min-width: 1100px) 58vw, 100vw" width={1536} height={1024} />
            <img data-hero="photo" src="/images/hero-mobile-480.webp" srcSet="/images/hero-mobile-480.webp 480w, /images/hero-mobile-800.webp 800w" sizes="100vw" width={1024} height={1176} alt="A sunlit living room with a pale stone floor, timber furniture and open glazing to a garden." fetchPriority="high" />
          </picture>
          <span className="hero__mask" data-hero="mask" aria-hidden="true" />
          <figcaption className="image-note">Generated inspiration image, not an ABC project</figcaption>
        </figure>
      </section>

      <section className="section collections-nav" aria-labelledby="collections-title">
        <div className="container">
          <div className="section-head" data-anim="reveal">
            <h2 className="section-title" id="collections-title">Six collections, one place to plan</h2>
            <p>The ranges ABC presents on its website, grouped the way a project comes together.</p>
          </div>
          <ul className="collection-grid">
            {COLLECTIONS.map(collection => {
              const cover = CATALOGUE.find(item => item.id === collection.cover)!
              return (
                <li key={collection.slug} className="collection-card" data-anim="card">
                  <Link to={`/collections/${collection.slug}`} className="collection-card__link">
                    <span className="collection-card__image"><ItemImg item={cover} alt="" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" /></span>
                    <span className="collection-card__name">{collection.name}</span>
                    <span className="collection-card__short">{collection.short}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="story" data-story aria-labelledby="story-title">
        <div className="story__stage">
          <div className="container story__grid">
            <div className="story__text">
              <h2 className="section-title" id="story-title">Start with a surface. Imagine the room.</h2>
              <p data-story="caption-swatch" className="story__caption">A sample of warm limestone tells you about tone and texture, but not how a whole floor will feel.</p>
              <p data-story="caption-room" className="story__caption">Seen across a room, the same calm tone sets the mood for everything else. That is why choosing materials early pays off.</p>
              <p className="fine-print">{ILLUSTRATIVE_FINISH}. The room is a generated illustration, not a rendering of a specific product.</p>
              <Link to="/inspiration/living-room-flooring" className="text-link">See this room’s ideas</Link>
            </div>
            <div className="story__frame">
              <div className="story__room" data-story="room"><SceneImg name="living-flooring" alt="A generated living room with a continuous pale stone-look floor." sizes="(min-width: 1024px) 55vw, 100vw" /></div>
              <div className="story__swatch" data-story="swatch">
                <TextureImg name="limestone" alt="Illustrative warm limestone texture." sizes="(min-width: 1024px) 55vw, 40vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section featured" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-head" data-anim="reveal">
            <h2 className="section-title" id="featured-title">From ABC’s own gallery</h2>
            <p>Pictured on ABC’s website. Brand, size and price are confirmed on request, so none are guessed here.</p>
          </div>
          <ul className="item-grid">
            {FEATURED.map(item => (
              <li key={item.id} className="item-card" data-anim="card">
                <Link to={`/collections/${item.collection}/${item.id}`} className="item-card__link">
                  <span className="item-card__image"><ItemImg item={item} alt={item.name} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" /></span>
                  <span className="item-card__collection">{COLLECTIONS.find(collection => collection.slug === item.collection)?.name}</span>
                  <span className="item-card__name">{item.name}</span>
                </Link>
                <AddToShortlist id={item.id} name={item.name} compact />
              </li>
            ))}
          </ul>
          <Link to="/collections" className="button button--outline">See every selection</Link>
        </div>
      </section>

      <section className="section how" aria-labelledby="how-title">
        <div className="container how__grid">
          <div className="section-head" data-anim="reveal">
            <h2 className="section-title" id="how-title">A shortlist instead of a basket</h2>
            <p>Building materials are rarely bought in one click. The shortlist keeps a project’s choices together until they are ready to discuss.</p>
            <Link to="/shortlist" className="button button--primary">Open your shortlist</Link>
          </div>
          <ol className="how__steps">
            {STEPS.map((step, index) => (
              <li key={step.title} data-anim="reveal">
                <span className="how__num" aria-hidden="true">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section inspiration-strip" aria-labelledby="inspiration-title">
        <div className="container">
          <div className="section-head" data-anim="reveal">
            <h2 className="section-title" id="inspiration-title">Rooms to think with</h2>
            <p>Four generated, fictional spaces that show how materials can work together. They are not ABC projects.</p>
          </div>
          <ul className="scene-grid">
            {SCENES.map(scene => (
              <li key={scene.slug} className="scene-card" data-anim="card">
                <Link to={`/inspiration/${scene.slug}`} className="scene-card__link">
                  <span className="scene-card__image"><SceneImg name={scene.image} alt="" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw" /></span>
                  <span className="scene-card__room">{scene.room}</span>
                  <span className="scene-card__title">{scene.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section showrooms-band" aria-labelledby="showrooms-title">
        <div className="container">
          <div className="section-head" data-anim="reveal">
            <h2 className="section-title" id="showrooms-title">See it in person</h2>
            <p>Four showrooms in Kampala, at the addresses ABC publishes. Choose one and it carries into your enquiry.</p>
          </div>
          <ul className="showroom-list">
            {SHOWROOMS.map(showroom => (
              <li key={showroom.slug} className="showroom-row" data-anim="card">
                {showroom.photo
                  ? <RefImg image={showroom.photo} width={1000} height={800} alt="" sizes="(min-width: 1024px) 12vw, 30vw" className="showroom-row__photo" />
                  : <span className="showroom-row__photo showroom-row__photo--none" aria-hidden="true" />}
                <div>
                  <h3><Link to={`/showrooms/${showroom.slug}`}>{showroom.name}</Link></h3>
                  <p>{showroom.address}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/showrooms/visit" className="button button--primary">Plan a showroom visit</Link>
        </div>
      </section>

      <section className="pro-band" aria-labelledby="pro-title">
        <div className="container pro-band__grid">
          <figure className="pro-band__image" data-anim="image">
            <SceneImg name="material-board" alt="A generated material board with stone, slate, brass and timber samples." sizes="(min-width: 1024px) 50vw, 100vw" />
            <figcaption className="image-note image-note--light">Generated illustration. Samples are illustrative, not stocked products.</figcaption>
          </figure>
          <div className="pro-band__text" data-anim="reveal">
            <h2 className="section-title" id="pro-title">Specifying for a project?</h2>
            <p>Architects, designers, contractors and developers can share a project brief covering every collection it involves, from bathrooms to floor finishes.</p>
            <Link to="/professionals" className="button button--light">Share a project brief</Link>
          </div>
        </div>
      </section>

      <section className="section closing" aria-labelledby="closing-title">
        <div className="container closing__inner" data-anim="reveal">
          <h2 className="closing__title" id="closing-title">Ready to talk about your project?</h2>
          <p>Bring your shortlist into one enquiry, or visit a showroom first.</p>
          <div className="button-row">
            <Link to="/quote" className="button button--primary button--large">Request a quote</Link>
            <Link to="/showrooms/visit" className="button button--outline button--large">Plan a showroom visit</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
