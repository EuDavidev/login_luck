import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function account(page) {
  await page.getByLabel('Seu nome').fill('Ana Silva');
  await page.getByLabel('E-mail').fill('ana@example.com');
  await page.getByLabel(/^Senha/).fill('aventura123');
  await page
    .getByRole('button', {
      name: 'Continuar',
      exact: true,
    })
    .click();
}
async function profile(page) {
  await page.getByLabel('Data de nascimento').fill('2000-10-09');
  await page
    .getByRole('combobox', {
      name: 'País',
    })
    .click();
  await page.getByPlaceholder('Buscar país...').fill('Brasil');
  await page
    .getByRole('option', {
      name: 'Brasil',
      exact: true,
    })
    .click();
  await page.getByLabel('Cidade').fill('São Paulo');
}
test('completes both stages, preserves fields on back, and resets', async ({ page }) => {
  await page.goto('/');
  await account(page);
  await expect(
    page.getByRole('heading', {
      name: 'Um pouco sobre você.',
    }),
  ).toBeVisible();
  await profile(page);
  await page
    .getByRole('button', {
      name: 'Voltar',
      exact: true,
    })
    .click();
  await expect(page.getByLabel('Seu nome')).toHaveValue('Ana Silva');
  await page
    .getByRole('button', {
      name: 'Continuar',
      exact: true,
    })
    .click();
  await expect(page.getByLabel('Cidade')).toHaveValue('São Paulo');
  await page
    .getByRole('button', {
      name: 'Concluir cadastro',
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('heading', {
      name: 'Sua aventura está pronta!',
    }),
  ).toBeVisible();
  await expect(page.getByText('Demonstração concluída — nenhuma conta foi criada.')).toBeVisible();
  await page
    .getByRole('button', {
      name: 'Recomeçar',
      exact: true,
    })
    .click();
  await expect(page.getByLabel('Seu nome')).toHaveValue('');
});
test('describes errors, focuses invalid field, and requires profile', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('button', {
      name: 'Continuar',
      exact: true,
    })
    .click();
  await expect(page.getByLabel('Seu nome')).toBeFocused();
  await expect(page.getByRole('alert').filter({ hasText: 'Revise' })).toContainText('Revise');
  await account(page);
  await page
    .getByRole('button', {
      name: 'Concluir cadastro',
      exact: true,
    })
    .click();
  await expect(page.getByLabel('Data de nascimento')).toBeFocused();
  await expect(page.getByRole('alert').filter({ hasText: 'Revise' })).toContainText('cidade');
});
test('supports accessibility preferences and keyboard country search', async ({ page }) => {
  await page.emulateMedia({
    reducedMotion: 'reduce',
  });
  await page.goto('/');
  await page
    .getByRole('button', {
      name: 'Acessibilidade',
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('switch', {
      name: 'Pausar animações',
    }),
  ).toBeChecked();
  await page
    .getByRole('switch', {
      name: 'Alto contraste',
    })
    .click();
  await page
    .getByRole('switch', {
      name: 'Texto ampliado',
    })
    .click();
  await expect(page.locator('.signup-app')).toHaveClass(/high-contrast/);
  await expect(page.locator('.signup-app')).toHaveClass(/large-text/);
  await page.keyboard.press('Escape');
  await account(page);
  await page
    .getByRole('combobox', {
      name: 'País',
    })
    .focus();
  await page.keyboard.press('Enter');
  await page.getByPlaceholder('Buscar país...').fill('Portugal');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('combobox', {
      name: 'País',
    }),
  ).toContainText('Portugal');
});
test('passes automated accessibility on both stages', async ({ page }) => {
  await page.goto('/');
  expect(
    (
      await new AxeBuilder({
        page,
      })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await account(page);
  expect(
    (
      await new AxeBuilder({
        page,
      })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test('fits the viewport at responsive sizes and enlarged text', async ({ page }) => {
  await page.goto('/');
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({
      width,
      height: 900,
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  await page.setViewportSize({
    width: 320,
    height: 800,
  });
  await page
    .getByRole('button', {
      name: 'Acessibilidade',
      exact: true,
    })
    .click();
  await page
    .getByRole('switch', {
      name: 'Texto ampliado',
    })
    .click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
test('rejects a future birth date and keeps profile values', async ({ page }) => {
  await page.goto('/');
  await account(page);
  await profile(page);
  await page.getByLabel('Data de nascimento').fill('2999-01-01');
  await page
    .getByRole('button', {
      name: 'Concluir cadastro',
      exact: true,
    })
    .click();
  await expect(
    page
      .getByText('A data de nascimento não pode estar no futuro.', {
        exact: true,
      })
      .last(),
  ).toBeVisible();
  await expect(page.getByLabel('Data de nascimento')).toBeFocused();
  await expect(page.getByLabel('Cidade')).toHaveValue('São Paulo');
});
