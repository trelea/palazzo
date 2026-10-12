import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'

import en from '../../messages/en.json'
import { ServicesMenu } from '@/components/services-menu'

/** Mirrors the component's intent delays; keep in sync with services-menu.tsx. */
const HOVER_OPEN_DELAY = 120
const HOVER_CLOSE_DELAY = 180

// This project runs Vitest without `globals: true`, so testing-library does not
// auto-register its `afterEach(cleanup)`. Without this the rendered menus pile
// up across tests and role queries match several elements.
afterEach(cleanup)

function renderMenu() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <ServicesMenu />
    </NextIntlClientProvider>,
  )
}

/** Radix opens the root menu from the trigger's onPointerDown (left button). */
function openMenu() {
  fireEvent.pointerDown(screen.getByRole('button', { name: /services/i }), {
    button: 0,
    ctrlKey: false,
    pointerType: 'mouse',
  })
}

/** Radix opens the nested submenu when the pointer moves over its trigger row. */
async function openPhytoSubmenu() {
  const phyto = await screen.findByRole('menuitem', { name: /phyto-esthetics/i })
  fireEvent.pointerEnter(phyto, { pointerType: 'mouse' })
  fireEvent.pointerMove(phyto, { pointerType: 'mouse' })
  return phyto
}

describe('ServicesMenu', () => {
  it('lists two top-level destinations and hides Face/Body until the submenu opens', async () => {
    renderMenu()
    openMenu()

    // Only the top-level services are visible — Face/Body live in the nested
    // flyout owned by the Phyto-Esthetics row.
    expect(await screen.findByRole('menuitem', { name: /phyto-esthetics/i })).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: /impacco/i })).toBeTruthy()
    expect(screen.queryByRole('menuitem', { name: /^face/i })).toBeNull()
    expect(screen.queryByRole('menuitem', { name: /^body/i })).toBeNull()
  })

  it('opens the Phyto-Esthetics submenu on hover and lists Face and Body', async () => {
    renderMenu()
    openMenu()
    await openPhytoSubmenu()

    expect(await screen.findByRole('menuitem', { name: /^face/i })).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: /^body/i })).toBeTruthy()
  })

  it('keeps Phyto-Esthetics a real link to its own page', async () => {
    renderMenu()
    openMenu()

    const phyto = await screen.findByRole('menuitem', { name: /phyto-esthetics/i })
    expect(phyto.tagName).toBe('A')
    expect(phyto.getAttribute('href')).toContain('/phytoaestetica')
    expect(phyto.getAttribute('href')).not.toContain('#')
  })

  it('renders every submenu row as a real link', async () => {
    renderMenu()
    openMenu()
    await openPhytoSubmenu()

    const face = await screen.findByRole('menuitem', { name: /^face/i })
    const body = screen.getByRole('menuitem', { name: /^body/i })
    for (const row of [face, body]) {
      expect(row.tagName).toBe('A')
      expect(row.getAttribute('href')).toBeTruthy()
    }
  })

  it('points Face/Body at the phyto page service params', async () => {
    renderMenu()
    openMenu()
    await openPhytoSubmenu()

    const face = await screen.findByRole('menuitem', { name: /^face/i })
    const body = screen.getByRole('menuitem', { name: /^body/i })
    expect(face.getAttribute('href')).toContain('/phytoaestetica?service=face')
    expect(body.getAttribute('href')).toContain('/phytoaestetica?service=body')
  })

  it('renders the submenu in a nested menu container (flyout, not inline rows)', async () => {
    renderMenu()
    openMenu()
    const phyto = await openPhytoSubmenu()
    const face = await screen.findByRole('menuitem', { name: /^face/i })

    // A Radix flyout renders its children inside a NESTED `role="menu"`: the
    // root panel plus one submenu. Face/Body sit in a different container
    // than the Phyto-Esthetics trigger row.
    expect(screen.getAllByRole('menu').length).toBe(2)
    expect(face.closest('[role="menu"]')).not.toBe(phyto.closest('[role="menu"]'))
  })

  it('keeps the root menu open when moving from the submenu back into the panel', async () => {
    renderMenu()
    openMenu()
    await openPhytoSubmenu()
    const face = await screen.findByRole('menuitem', { name: /^face/i })

    // Leaving the flyout must not schedule a root close: the sub panel is
    // DOM-inside the root panel, so in a real browser no root `pointerleave`
    // follows to cancel — only the flyout itself may close. (Note: plain
    // `fireEvent.pointerLeave` cannot model this in jsdom — it fires
    // ancestors' handlers too, which never happens in a browser. `pointerOut`
    // with `relatedTarget` inside the root panel reproduces the real
    // enter/leave boundary instead.)
    const subMenu = face.closest('[role="menu"]')
    const rootMenu = screen
      .getByRole('menuitem', { name: /impacco/i })
      .closest('[role="menu"]')
    expect(subMenu).toBeTruthy()
    expect(rootMenu).toBeTruthy()
    expect(subMenu).not.toBe(rootMenu)
    fireEvent.pointerOut(subMenu!, { pointerType: 'mouse', relatedTarget: rootMenu })

    await new Promise((r) => setTimeout(r, HOVER_CLOSE_DELAY + 80))
    expect(screen.getByRole('menuitem', { name: /phyto-esthetics/i })).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: /impacco/i })).toBeTruthy()
  })

  it('opens on hover (Radix root triggers only respond to click/keyboard)', async () => {
    renderMenu()
    const trigger = screen.getByRole('button', { name: /services/i })

    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })

    // Opens after the hover-intent delay, not synchronously.
    expect(screen.queryByRole('menuitem', { name: /impacco/i })).toBeNull()
    expect(await screen.findByRole('menuitem', { name: /impacco/i })).toBeTruthy()
  })

  it('stays open while the pointer moves from the trigger into the panel', async () => {
    renderMenu()
    const trigger = screen.getByRole('button', { name: /services/i })

    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
    await screen.findByRole('menuitem', { name: /impacco/i })

    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' })
    fireEvent.pointerEnter(screen.getByRole('menu'), { pointerType: 'mouse' })

    // The pending close must be cancelled by entering the panel.
    await new Promise((r) => setTimeout(r, HOVER_CLOSE_DELAY + 80))
    expect(screen.getByRole('menuitem', { name: /impacco/i })).toBeTruthy()
  })

  it('closes again after the pointer leaves the trigger', async () => {
    renderMenu()
    const trigger = screen.getByRole('button', { name: /services/i })

    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
    await screen.findByRole('menuitem', { name: /impacco/i })

    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' })

    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: /impacco/i })).toBeNull()
    })
  })

  it('does not open on touch, where a tap should behave like a click', async () => {
    renderMenu()
    const trigger = screen.getByRole('button', { name: /services/i })

    fireEvent.pointerEnter(trigger, { pointerType: 'touch' })
    await new Promise((r) => setTimeout(r, HOVER_OPEN_DELAY + 80))

    expect(screen.queryByRole('menuitem', { name: /impacco/i })).toBeNull()
  })
})
