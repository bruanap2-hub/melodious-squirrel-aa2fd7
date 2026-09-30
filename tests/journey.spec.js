import { test, expect } from "@playwright/test";

const sofiaMessage = "Vc sempre será meu anjo,mo anielo\n— Sofia";
const volleyballMessage =
  "Feliz aniversário, Bia! 💗🏐 Que seu dia seja maravilhoso e cheio de coisas boas! Você sabe que no vôlei é nós duas: se você cai, eu caio; se você sai, eu também saio 😂😂 Parece até que estamos conectadas!\n\nObrigada por todos os momentos e por ser essa pessoa incrível. Que Deus abençoe muito sua vida e que você continue sendo essa menina maravilhosa. Te adoro! 💕";

async function enterWorld(page, isMobile) {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Começar a jornada" }),
  ).toBeVisible();
  const start = page.getByRole("button", { name: "Começar a jornada" });
  if (isMobile) await start.tap();
  else await start.click();
  await expect(page.locator(".state-wand")).toBeVisible();
  const portal = page.getByRole("button", {
    name: "Ativar o portal mágico e iniciar a cerimônia",
  });
  if (isMobile) await portal.tap();
  else {
    const bounds = await portal.boundingBox();
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
  }
  await expect(page.locator(".state-ceremony")).toBeVisible();
  await expect(page.locator(".state-revelation")).toBeVisible({
    timeout: 25000,
  });
  await expect(
    page.locator('.house-shield svg[data-house="lufa-lufa"]'),
  ).toBeVisible();
  await expect(page.locator(".house-shield img")).toHaveCount(0);
  await page.getByRole("button", { name: "Entrar na escola" }).click();
  await expect(page.locator(".state-school")).toBeVisible();
}

test("a jornada completa revela a casa e preserva as memórias", async ({
  page,
  isMobile,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await enterWorld(page, isMobile);
  await page
    .getByRole("button", { name: "Academia: entrar", exact: true })
    .click();
  await expect(page.locator(".state-academy")).toBeVisible();
  await expect(page.locator(".portrait")).toHaveCount(6);
  await expect(page.locator(".portrait.filled")).toHaveCount(2);
  await expect(page.locator(".portrait.awaiting")).toHaveCount(4);

  await page.locator(".portrait-one").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".memory-message")).toHaveText(sofiaMessage);
  const originalPhoto = page.locator(".memory-photo img");
  await expect(originalPhoto).toHaveAttribute("src", "/img/foto_01_sofia.jpg");
  await expect
    .poll(() =>
      originalPhoto.evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBeTruthy();
  await expect(originalPhoto).toHaveCSS("object-fit", "contain");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator(".portrait-one")).toBeFocused();

  await page.locator(".portrait-three").scrollIntoViewIfNeeded();
  await page.locator(".portrait-three").click();
  await expect(page.locator(".memory-message")).toHaveText(volleyballMessage);
  await expect(page.locator(".memory-photo img")).toHaveAttribute(
    "src",
    "/img/foto_02_volei.jpg",
  );
  await page.getByRole("button", { name: "Guardar no coração" }).click();
  await expect(page.locator(".memory-count")).toHaveText(
    "2 / 2 memórias descobertas",
  );

  for (const position of ["two", "four", "five", "six"]) {
    await page.locator(`.portrait-${position}`).scrollIntoViewIfNeeded();
    await page.locator(`.portrait-${position}`).click();
    await expect(page.locator(".memory-message")).toContainText(
      "A próxima memória ainda está sendo escrita.",
    );
    await page.getByRole("button", { name: "Continuar explorando" }).click();
  }
  if (isMobile) {
    expect(
      await page
        .locator(".gallery-scroll")
        .evaluate((el) => el.scrollWidth > el.clientWidth),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Voltar ao Salão Principal" }).click();
  await expect(page.locator(".state-school")).toBeVisible();
  await page
    .getByRole("button", { name: "Sala Comunal: disponível em breve" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Esta passagem ainda guarda seus segredos.",
  );
  await page.getByRole("button", { name: "Continuar explorando" }).click();
  await page.getByRole("button", { name: "Como explorar a jornada" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Mova a varinha até a luz",
  );
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
});

test("movimento reduzido mantém a progressão automática e o som é opcional", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterWorld(page, isMobile);
  const soundButton = page.getByRole("button", { name: "Ativar som ambiente" });
  await expect(soundButton).toHaveAttribute("aria-pressed", "false");
  await soundButton.click();
  await expect(
    page.getByRole("button", { name: "Desativar som ambiente" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Desativar som ambiente" }).click();
  await expect(
    page.getByRole("button", { name: "Ativar som ambiente" }),
  ).toHaveAttribute("aria-pressed", "false");
});
