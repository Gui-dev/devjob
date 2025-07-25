import { test, expect } from '@playwright/test'

test('should be able to navigate to job details and apply for a job', async ({
  page,
}) => {
  await page.goto('/login')

  await page.getByPlaceholder('Email').fill('barry@email.com')
  await page.getByPlaceholder('Senha').fill('123456')

  await page.getByRole('button', { name: /entrar/i }).click()

  await expect(page).toHaveURL('/', { timeout: 60000 })

  const firstJob = page.locator('[data-testid="job-card"]').first()
  await firstJob.click()

  await expect(page).toHaveURL(/\/job\/.*\/details/, {
    timeout: 60000,
  })

  const applyButton = page.getByRole('button', { name: /me candidatar/i })
  await applyButton.click()

  await page
    .getByPlaceholder(/por que essa vaga é ideal para você ?/i)
    .fill('Mensagem de teste')
  await page
    .getByPlaceholder(/https:\/\/github.com\/seu-perfil/i)
    .fill('https://github.com/username')
  await page
    .getByPlaceholder(/https:\/\/linkedin.com\/in\/seu-perfil/i)
    .fill('https://linkedin.com/in/username')

  await page.getByRole('button', { name: /enviar candidatura/i }).click()

  await expect(
    page.getByText(/candidatura enviada com sucesso!/i),
  ).toBeVisible()
})
