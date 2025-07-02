import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

import { server } from './mocks/server'

// NOVO: Mock para resolver o erro 'hasPointerCapture' do Radix UI/JSDOM
if (typeof Element.prototype.hasPointerCapture === 'undefined') {
  Element.prototype.hasPointerCapture = vi.fn(() => false)
}
if (typeof Element.prototype.releasePointerCapture === 'undefined') {
  Element.prototype.releasePointerCapture = vi.fn(() => {})
}

if (typeof Element.prototype.scrollIntoView === 'undefined') {
  Element.prototype.scrollIntoView = vi.fn()
}

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
