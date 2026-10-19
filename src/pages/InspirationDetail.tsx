import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SceneImg, TextureImg } from '../components/Img'
import { findCollection } from '../data/collections'
import { ILLUSTRATIVE_FINISH, SCENES, findFinish, findScene } from '../data/inspiration'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import NotFound from './NotFound'

export default function InspirationDetail() {
  const { slug } = useParams()
  const scene = findScene(slug)
  useDocumentTitle(scene?.title ?? 'Room not found')
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  if (!scene) return <NotFound what="room" />
  const others = SCENES.filter(other => other.slug !== scene.slug)

  return (
    <article ref={root} className="scene">
      <header className="container scene__head">
        <Breadcrumbs trail={[{ label: 'Inspiration', to: '/inspiration' }, { label: scene.room }]} />
        <h1>{scene.title}</h1>
        <p className="lede">{scene.summary}</p>
      </header>
      <figure className="scene__hero" data-anim="image">
        <SceneImg name={scene.image} alt={`Generated ${scene.room.toLowerCase()}: ${scene.summary}`} sizes="100vw" priority />
        <figcaption className="container">Generated, fictional room. It does not show specific products or an ABC project.</figcaption>
      </figure>

      <div className="container scene__body">
        <section aria-labelledby="ideas-title">
          <h2 className="section-title" id="ideas-title">Ideas to take from it</h2>
          <ol className="ideas">{scene.ideas.map(idea => <li key={idea.title} data-anim="reveal"><h3>{idea.title}</h3><p>{idea.body}</p></li>)}</ol>
        </section>

        <aside className="scene__side">
          <section aria-labelledby="palette-title">
            <h2 id="palette-title">Palette</h2>
            <ul className="palette">
              {scene.finishes.map(id => {
                const finish = findFinish(id)
                return <li key={id}><TextureImg name={id} alt="" sizes="72px" /><span>{finish.name}<small>{ILLUSTRATIVE_FINISH}</small></span></li>
              })}
            </ul>
          </section>
          <section aria-labelledby="related-collections-title">
            <h2 id="related-collections-title">Explore related collections</h2>
            <ul className="link-stack">
              {scene.collections.map(slug => {
                const collection = findCollection(slug)!
                return <li key={slug}><Link to={`/collections/${slug}`}>{collection.name}</Link></li>
              })}
            </ul>
            <p className="fine-print">Related ranges to explore, not the exact items in this picture.</p>
          </section>
        </aside>
      </div>

      <section className="container section section--tight" aria-labelledby="more-rooms">
        <h2 className="section-title" id="more-rooms">More rooms</h2>
        <ul className="scene-grid scene-grid--three">
          {others.map(other => (
            <li key={other.slug} className="scene-card">
              <Link to={`/inspiration/${other.slug}`} className="scene-card__link">
                <span className="scene-card__image"><SceneImg name={other.image} alt="" sizes="(min-width: 1024px) 30vw, 100vw" /></span>
                <span className="scene-card__room">{other.room}</span>
                <span className="scene-card__title">{other.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
