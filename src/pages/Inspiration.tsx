import { useRef } from 'react'
import { Link } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { SceneImg, TextureImg } from '../components/Img'
import { PageIntro } from '../components/PageIntro'
import { FINISHES, ILLUSTRATIVE_FINISH, SCENES } from '../data/inspiration'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Inspiration() {
  useDocumentTitle('Inspiration')
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)

  return (
    <div ref={root}>
      <PageIntro kicker="Inspiration" title="Rooms to think with">
        <p>Four generated, fictional spaces, each showing one way materials can work together. They are separate rooms, not one home, and not ABC projects.</p>
      </PageIntro>

      <section className="container section section--tight" aria-label="Rooms">
        <ul className="scene-list">
          {SCENES.map((scene, index) => (
            <li key={scene.slug} className={`scene-row ${index % 2 ? 'scene-row--flip' : ''}`}>
              <figure className="scene-row__image" data-anim="image"><SceneImg name={scene.image} alt="" sizes="(min-width: 1024px) 58vw, 100vw" /></figure>
              <div className="scene-row__text" data-anim="reveal">
                <p className="kicker">{scene.room}</p>
                <h2 className="section-title"><Link to={`/inspiration/${scene.slug}`}>{scene.title}</Link></h2>
                <p>{scene.summary}</p>
                <Link to={`/inspiration/${scene.slug}`} className="text-link">See the ideas</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section section--stone" aria-labelledby="finishes-title">
        <div className="container">
          <div className="section-head" data-anim="reveal">
            <h2 className="section-title" id="finishes-title">A starting palette</h2>
            <p>Four generic textures used across these rooms. They help describe a look in conversation; they are not samples.</p>
          </div>
          <ul className="finish-grid">
            {FINISHES.map(finish => (
              <li key={finish.id} className="finish" data-anim="card">
                <TextureImg name={finish.id} alt="" sizes="(min-width: 1024px) 22vw, 45vw" />
                <h3>{finish.name}</h3>
                <p>{finish.note}</p>
                <p className="finish__label">{ILLUSTRATIVE_FINISH}</p>
              </li>
            ))}
          </ul>
          <figure className="material-board" data-anim="image">
            <SceneImg name="material-board" alt="A generated material board combining pale stone, dark slate, a brushed metal square and timber slats." sizes="(min-width: 1024px) 80vw, 100vw" />
            <figcaption>Combining finishes: pale stone for large areas, one dark surface for weight, timber for warmth, and a little metal. Generated illustration.</figcaption>
          </figure>
        </div>
      </section>
    </div>
  )
}
