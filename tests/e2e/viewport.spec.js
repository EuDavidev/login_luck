import { test, expect } from '@playwright/test';
async function account(page) {
  await page.getByLabel('Seu nome').fill('Ana Silva');
  await page.getByLabel('E-mail').fill('ana@example.com');
  await page.getByLabel(/^Senha/).fill('aventura123');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
}
for (const [width, height] of [
  [1366, 768],
  [1440, 900],
  [1024, 768],
  [375, 812],
  [390, 844],
  [375, 667],
]) {
  test('fits without vertical scroll ' + width + 'x' + height, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.getByRole('button', { name: 'Continuar', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(
      true,
    );
    await account(page);
    await expect(
      page.getByRole('button', { name: 'Concluir cadastro', exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(
      true,
    );
  });
}
test('four new preferences work and the dialog returns focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Acessibilidade', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Do seu jeito.' })).toBeVisible();
  await page.getByRole('switch', { name: 'Fonte simples', exact: true }).click();
  await page.getByRole('switch', { name: 'Mais espaçamento', exact: true }).click();
  await page.getByRole('button', { name: 'Conforto', exact: true }).click();
  await page.getByRole('switch', { name: 'Modo foco', exact: true }).click();
  await page.getByRole('switch', { name: 'Dicas de preenchimento', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Acessibilidade', exact: true })).toBeFocused();
  await expect(page.locator('.signup-app')).toHaveClass(/simple-font/);
  await expect(page.locator('.signup-app')).toHaveClass(/reading-space/);
  await expect(page.locator('.signup-app')).toHaveClass(/focus-mode/);
  await expect(page.getByText('Digite o nome pelo qual prefere ser chamado.')).toBeVisible();
});

test('enlarged text and hints reflow without overlapping the footer', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Acessibilidade', exact: true }).click();
  await page.getByRole('switch', { name: 'Texto ampliado', exact: true }).click();
  await page.getByRole('switch', { name: 'Mais espaçamento', exact: true }).click();
  await page.getByRole('button', { name: 'Conforto', exact: true }).click();
  await page.getByRole('switch', { name: 'Dicas de preenchimento', exact: true }).click();
  await page.keyboard.press('Escape');
  for (let stage = 1; stage <= 2; stage++) {
    const panel = await page.locator('.form-panel').boundingBox();
    const footer = await page.locator('.site-footer').boundingBox();
    expect(footer.y).toBeGreaterThanOrEqual(panel.y + panel.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (stage === 1) await account(page);
  }
});
test('validation errors fit on a small phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(
    true,
  );
  await account(page);
  await page.getByRole('button', { name: 'Concluir cadastro', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(
    true,
  );
});
