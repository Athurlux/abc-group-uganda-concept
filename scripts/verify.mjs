// Compact browser journey check. Run against a preview build:
//   npm run build && npm run preview -- --port 4177   (another terminal)
//   npm run verify     or   VERIFY_URL=https://abc-group-uganda-redesign.pages.dev npm run verify
// One headless Chrome, one page at a time. Checks wait for state rather than sampling once.
import { chromium } from 'playwright'

const BASE = (process.env.VERIFY_URL ?? 'http://127.0.0.1:4177').replace(/\/$/, '')
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const KEY = 'abcg-concept-shortlist'
const results = []
const check = (name, ok, detail = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`) }

const browser = await chromium.launch({ executablePath: CHROME })
const context = await browser.newContext({ viewport: { width: 1280, height: 860 } })
const page = await context.newPage()
const requests = []
const failures = []
const errors = []
page.on('request', request => requests.push({ method: request.method(), url: request.url() }))
page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`) })
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })

const go = async path => { await page.goto(BASE + path, { waitUntil: 'networkidle' }) }
const sees = async (text, timeout = 8000) => page.getByText(text).first().waitFor({ timeout }).then(() => true, () => false)
const waitFor = (fn, arg) => page.waitForFunction(fn, arg, { timeout: 5000 }).then(() => true, () => false)
const button = name => page.getByRole('button', { name, exact: true })
const count = () => page.locator('.shortlist-toggle .count').innerText()
const stored = () => page.evaluate(key => localStorage.getItem(key), KEY)
const cards = n => waitFor(n => document.querySelectorAll('.catalogue .item-card').length === n, n)
const kampalaDate = offset => {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Kampala' }).format(new Date())
  const date = new Date(`${today}T00:00:00Z`); date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}
const runSample = async finalLabel => {
  for (let step = 0; step < 6 && !(await button(finalLabel).count()); step++) {
    if (await page.locator('.flow__head button').count()) await page.locator('.flow__head button').click()
    await page.locator('.flow__actions button[type="submit"]').click()
    await page.waitForTimeout(150)
  }
  return (await button(finalLabel).count()) > 0
}

try {
  // 1. Collections: search, filter, empty state, Back, chips, reset
  await go('/')
  await page.getByRole('link', { name: 'Explore collections' }).first().click()
  check('hero CTA reaches collections', await sees('Materials for every room'))
  await page.locator('#catalogue-q').fill('sink')
  await page.waitForURL(/q=sink/)
  check('search narrows and lives in the URL', await cards(2))
  await page.locator('#catalogue-collection').selectOption('wall-panels')
  check('conflicting filters show a useful empty state', await sees('Nothing matches these filters.'))
  await page.goBack()
  await page.waitForURL(url => !url.toString().includes('collection='))
  check('Back undoes the last filter', await cards(2))
  await page.getByRole('button', { name: /“sink”: remove filter/ }).click()
  check('removing the search chip shows all 13', await cards(13))
  await page.locator('#catalogue-type').selectOption('application')
  check('image-type filter', await cards(4) && await sees('4 of 13 selections'))
  await page.getByRole('button', { name: 'Reset all' }).click()
  check('reset restores every selection', await cards(13) && !page.url().includes('?'))

  // 2. Item detail and shortlist merging
  await page.getByRole('link', { name: 'White pedestal basin' }).first().click()
  await page.waitForURL(/sanitaryware\/sanitaryware-02/)
  check('item detail shows confirmed and to-confirm details, no price', await sees('Details to be confirmed') && !(await page.locator('main').innerText()).includes('UGX'))
  check('discrepancy note keeps the source label', await page.getByText('About this image’s published label').isVisible())
  await page.getByRole('button', { name: 'Add to shortlist' }).click()
  check('adding gives feedback and updates the header', await sees('added to your project shortlist') && (await count()) === '1')
  await page.getByRole('button', { name: /On shortlist/ }).click()
  check('adding again merges into one entry', await sees('On shortlist (2 pieces)') && (await count()) === '1')
  await go('/collections/tiles')
  await page.getByRole('button', { name: 'Add Bathroom with large-format marble-look walls to shortlist' }).click()
  check('application reference added as a second entry', await waitFor(() => document.querySelector('.shortlist-toggle .count')?.textContent === '2'))

  // 3. Drawer dialog: focus, Escape, restore
  await page.locator('.shortlist-toggle').click()
  const dialog = page.getByRole('dialog', { name: 'Project shortlist' })
  check('drawer opens with focus inside', await dialog.isVisible() && await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null))
  check('drawer lists both units honestly', await dialog.getByText('2 pieces').isVisible() && await dialog.getByText('Quantity to confirm').isVisible())
  await page.keyboard.press('Escape')
  check('Escape closes the drawer and restores focus', (await dialog.isVisible()) === false && await page.evaluate(() => document.activeElement?.classList.contains('shortlist-toggle')))

  // 4. Shortlist page: persistence, quantity, storage contents, clear and undo
  await go('/shortlist')
  await page.reload({ waitUntil: 'networkidle' })
  check('shortlist survives a refresh', (await page.locator('.shortlist-page .shortlist-row').count()) === 2)
  await page.getByRole('button', { name: 'One more White pedestal basin' }).click()
  check('quantity can be raised', await sees('3 pieces'))
  await page.getByRole('button', { name: 'One fewer White pedestal basin' }).click()
  check('storage holds only IDs, counts and showroom', (await stored()) === '{"version":1,"items":[{"id":"sanitaryware-02","qty":2},{"id":"tiles-01","qty":null}],"showroom":null}', await stored())
  await page.locator('.shortlist-page__bar').getByRole('button', { name: 'Clear shortlist' }).click()
  check('clearing shows the empty state', await sees('Your project shortlist is empty.'))
  await page.getByRole('button', { name: 'Undo' }).click()
  check('clearing can be undone', await waitFor(() => document.querySelectorAll('.shortlist-page .shortlist-row').length === 2))

  // 5. Preferred showroom carries into the quote; full quote journey
  await go('/showrooms/hauz')
  await page.getByRole('button', { name: 'Use as my preferred showroom' }).click()
  await go('/quote')
  check('quote starts from the selections', await page.locator('.flow__selections .shortlist-row').count() === 2)
  await button('Continue').click()
  await button('Continue').click()
  check('empty project step shows an error summary and moves focus', await page.locator('.error-summary').isVisible() && await waitFor(() => document.activeElement?.closest('#role') !== null))
  await button('Use sample details').click()
  await page.getByLabel('Contractor').check()
  check('organisation field appears for non-homeowners', await page.locator('#organisation').isVisible())
  await button('Continue').click()
  check('preferred showroom carried into the form', (await page.locator('#showroom').inputValue()) === 'hauz')
  await button('Use sample details').click()
  check('sample details do not overwrite the carried showroom', (await page.locator('#showroom').inputValue()) === 'hauz')
  await button('Review').click()
  await page.getByRole('button', { name: /Edit Your project/ }).click()
  await page.locator('#location').fill('Mukono')
  await button('Continue').click(); await button('Review').click()
  check('review reflects the edit and lists the selections', await sees('Mukono') && await page.locator('.selection-summary li').count() === 2)
  await button('Complete demo quote request').dblclick()
  await page.waitForURL(/\/quote\/confirmation\/ABC-/)
  check('confirmation says nothing was sent', await sees('Demo complete. No quote request was sent.'))
  check('confirmation summarises selections and project, with print', await page.locator('.selection-summary li').count() === 2 && await sees('Mukono') && await page.getByRole('button', { name: 'Print or save as PDF' }).isVisible())
  await page.goBack({ waitUntil: 'networkidle' })
  // Wait for the page heading (the hidden mobile menu also contains this text).
  const backOnForm = await page.getByRole('heading', { level: 1, name: 'Request a quote' }).waitFor({ timeout: 8000 }).then(() => true, () => false)
  check('Back cannot resubmit a filled review', backOnForm && !(await button('Complete demo quote request').isVisible().catch(() => false)))
  await page.goForward({ waitUntil: 'networkidle' })
  await page.reload({ waitUntil: 'networkidle' })
  check('refreshed confirmation shows an honest fallback', await sees('There’s no quote request to show here.'))

  // 6. Visit request: carried showroom, Kampala dates
  await go('/showrooms/visit?showroom=ceramic')
  check('visit preselects the showroom from the link', await page.getByLabel(/^ABC Ceramic/).isChecked())
  await page.locator('#purpose').selectOption('browse')
  await page.locator('#date').fill(kampalaDate(-1))
  await page.getByLabel(/^Morning/).check()
  await button('Continue').click()
  check('past date rejected', (await page.locator('#date-error').innerText()).includes('today or a later date'))
  await page.locator('#date').fill(kampalaDate(0)); await button('Continue').click()
  check('today rejected in Kampala time', (await page.locator('#date-error').innerText()).includes('tomorrow'))
  await page.locator('#date').fill(kampalaDate(3)); await button('Continue').click()
  check('visit completes without booking', await runSample('Complete demo visit request') && (await button('Complete demo visit request').click(), await sees('No appointment was booked')))

  // 7. Professional brief and contact (with a product question carried in)
  await go('/professionals')
  check('project brief completes', await runSample('Complete demo project brief') && (await button('Complete demo project brief').click(), await sees('No brief was sent')))
  await go('/contact?item=sanitaryware-03')
  check('“Request product details” pre-writes the question', (await page.locator('#message').inputValue()).includes('Single-lever basin mixer'))
  check('real contact details kept apart from the form', await page.locator('.real-contact').getByText('info@abcgroupuganda.com').isVisible())
  check('contact completes', await runSample('Complete demo message') && (await button('Complete demo message').click(), await sees('No message was sent.')))

  // 8. Empty shortlist and direct routes
  await page.evaluate(key => localStorage.setItem(key, '{"version":1,"items":[{"id":"ghost"}]'), KEY)
  await go('/quote')
  check('corrupt storage recovers to an empty shortlist', await sees('Your project shortlist is empty.') && (await count()) === '0')
  for (const [path, text] of [
    ['/collections/kitchen-sinks/kitchensinks-01', 'Two-bowl sink with pull-down mixer'],
    ['/inspiration/garden-bathroom', 'A bathroom that borrows the garden'],
    ['/showrooms/casa-ceramica', 'ABC hasn’t published a photo of this showroom.'],
    ['/showrooms/warehouse', 'We couldn’t find that showroom.'],
    ['/quote/confirmation/ABC-NOPE', 'There’s no quote request to show here.'],
    ['/no-such-page', 'This page isn’t here.'],
  ]) { await go(path); check(`direct load ${path}`, await sees(text)) }
  await go('/collections/tiles/sanitaryware-01')
  check('item under the wrong collection redirects', await waitFor(() => location.pathname === '/collections/sanitaryware/sanitaryware-01'))

  // 9. Keyboard menu at phone width; reduced motion
  await page.setViewportSize({ width: 390, height: 800 })
  await go('/about')
  await page.getByRole('button', { name: 'Open menu' }).click()
  check('mobile menu focuses its first link', await page.evaluate(() => document.activeElement?.textContent === 'Home'))
  await page.keyboard.press('Escape')
  check('Escape closes the menu and restores focus', await page.evaluate(() => document.activeElement?.getAttribute('aria-label') === 'Open menu'))
  const reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1280, height: 860 } })
  await reduced.goto(BASE + '/', { waitUntil: 'networkidle' })
  check('reduced motion: settled hero and a static material story', await reduced.evaluate(() => !document.documentElement.classList.contains('hero-pending')
    && getComputedStyle(document.querySelector('[data-hero="line"]')).transform === 'none' && !document.querySelector('.story--scrub')))
  await reduced.close()

  // 10. No trigger build-up across navigation and resizing
  await page.setViewportSize({ width: 1280, height: 860 })
  await go('/')
  const initial = await page.evaluate(() => window.__scrollTriggerCount?.())
  for (let i = 0; i < 3; i++) {
    await page.locator('.site-nav').getByRole('link', { name: 'Inspiration' }).click()
    await page.waitForURL(/inspiration/)
    await page.getByRole('link', { name: 'ABC Group Uganda concept, home' }).click()
    await page.waitForURL(url => new URL(url).pathname === '/')
  }
  for (const width of [800, 1280, 900, 1300, 1280]) { await page.setViewportSize({ width, height: 860 }); await page.waitForTimeout(200) }
  await page.waitForTimeout(400)
  const after = await page.evaluate(() => window.__scrollTriggerCount?.())
  check('ScrollTrigger count stable after navigation and resizing', typeof initial === 'number' && after === initial, `${initial} → ${after}`)

  // 11. Overflow sweep
  const overflow = []
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 860 })
    for (const path of ['/', '/collections', '/collections/sanitaryware/sanitaryware-04', '/shortlist', '/quote', '/inspiration/open-kitchen', '/showrooms', '/showrooms/hauz', '/professionals']) {
      await go(path)
      const extra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      if (extra > 0) overflow.push(`${path}@${width}:${extra}`)
    }
  }
  check('no horizontal overflow at 360–1440', overflow.length === 0, overflow.join(', '))

  // 12. Nothing leaves the browser; nothing broken
  const origin = new URL(BASE).origin
  const nonGet = requests.filter(request => request.method !== 'GET')
  const thirdParty = requests.filter(request => !request.url.startsWith(origin) && !request.url.startsWith('data:'))
  const personal = requests.filter(request => /amani|nakato|okello|example\.com|0772|mukono/i.test(decodeURIComponent(request.url)))
  check('no non-GET requests', nonGet.length === 0, nonGet.map(request => request.url).join(', '))
  check('no third-party requests', thirdParty.length === 0, [...new Set(thirdParty.map(request => new URL(request.url).host))].join(', '))
  check('no personal data in any request URL', personal.length === 0)
  const storage = await page.evaluate(() => ({ local: Object.keys(localStorage), dump: JSON.stringify({ ...localStorage, ...sessionStorage }) }))
  check('no personal data in browser storage', storage.local.every(key => key === 'abcg-concept-shortlist') && !/amani|nakato|okello|daniel|example\.com|0772|0701|mukono|kira/i.test(storage.dump), storage.local.join(', '))
  check('no failed requests (images, chunks)', failures.length === 0, failures.slice(0, 3).join(' | '))
  check('no console or page errors', errors.length === 0, errors.slice(0, 3).join(' | '))
} catch (error) {
  check('journey ran to completion', false, error.message.split('\n')[0])
} finally {
  await browser.close()
}

const failed = results.filter(result => !result.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
