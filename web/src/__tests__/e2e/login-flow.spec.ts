import { test, expect } from '@playwright/test'

test('should be able to login', async ({ page }) => {
  await page.goto('/login')

  await page.getByPlaceholder('Email').fill('bruce@email.com')
  await page.getByPlaceholder('Senha').fill('123456')

  await page.getByRole('button', { name: /entrar/i }).click()

  await expect(page).toHaveURL('/', { timeout: 60000 })
})
