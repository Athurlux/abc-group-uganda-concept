import { createBrowserRouter } from 'react-router'
import { Layout } from './components/Layout'
import { RouteError } from './pages/RouteError'

// Each page is its own chunk; GSAP is pulled in only by the pages that animate.
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({ Component: (await load()).default })

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    hydrateFallbackElement: <div className="route-loading" aria-busy="true" />,
    children: [
      { index: true, lazy: page(() => import('./pages/Home')) },
      { path: 'collections', lazy: page(() => import('./pages/Collections')) },
      { path: 'collections/:slug', lazy: page(() => import('./pages/CollectionDetail')) },
      { path: 'collections/:slug/:itemId', lazy: page(() => import('./pages/ItemDetail')) },
      { path: 'shortlist', lazy: page(() => import('./pages/Shortlist')) },
      { path: 'quote', lazy: page(() => import('./pages/Quote')) },
      { path: 'quote/confirmation/:reference', lazy: page(() => import('./pages/QuoteConfirmation')) },
      { path: 'inspiration', lazy: page(() => import('./pages/Inspiration')) },
      { path: 'inspiration/:slug', lazy: page(() => import('./pages/InspirationDetail')) },
      { path: 'showrooms', lazy: page(() => import('./pages/Showrooms')) },
      { path: 'showrooms/visit', lazy: page(() => import('./pages/Visit')) },
      { path: 'showrooms/:slug', lazy: page(() => import('./pages/ShowroomDetail')) },
      { path: 'professionals', lazy: page(() => import('./pages/Professionals')) },
      { path: 'about', lazy: page(() => import('./pages/About')) },
      { path: 'contact', lazy: page(() => import('./pages/Contact')) },
      { path: '*', lazy: page(() => import('./pages/NotFound')) },
    ],
  },
])
