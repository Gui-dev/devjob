import { test, expect } from '@playwright/test'

test('should be able to register a new user', async ({ page }) => {
  await page.goto('/register')

  const email = `test_email_playwright_${Date.now()}@email.com`

  await page.getByPlaceholder('Nome').fill('Playwright Name')
  await page.getByPlaceholder('Email').fill(email)
  await page.getByPlaceholder('Senha').fill('123456')
  await page.getByText(/selecione um tipo de conta/i).click()
  await page.getByRole('option', { name: /candidato/i }).click()

  await page.getByRole('button', { name: /criar conta/i }).click()

  await expect(page).toHaveURL('/login', { timeout: 60000 })
})
