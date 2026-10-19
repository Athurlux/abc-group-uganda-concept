import { useEffect } from 'react'

const SITE = 'ABC Group Uganda (concept)'

export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} · Tiles, sanitaryware and interior materials`
  }, [title])
}
