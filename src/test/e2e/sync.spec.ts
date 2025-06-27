import test, { expect, type Page } from "@playwright/test";
import {
  adjustListCardQuantity,
  fillSearch,
  importDeckFromFile,
} from "./actions";

const props = {
  tag: ["@sync"],
};

test.describe.configure({ mode: "serial" });

test.describe("ArkhamDB sync", props, () => {
  test.skip(
    () => !process.env.ARKHAMDB_USERNAME || !process.env.ARKHAMDB_PASSWORD,
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
  });

  test("connect ArkhamDB account", async ({ page }) => {
    await connectArkhamDB(page);
  });

  test("disconnect ArkhamDB account", async ({ page }) => {
    await connectArkhamDB(page);
    await uploadArkhamDBDeck(page);

    await page.goto("/");
    await expect(page.getByTestId("deck-summary-title")).toContainText(
      "deck notes test",
    );
    await page.goto("/settings");
    await page.getByRole("button", { name: "Disconnect" }).click();
    await expect(page.getByTestId("connection-status")).not.toBeVisible();

    await page.goto("/");
    await expect(page.getByTestId("deck-summary-title")).not.toBeVisible();

    await page.goto("/settings");
    await connectArkhamDB(page);

    await page.goto("/");
    await page.getByTestId("collection-deck").click();
    await cleanupDeck(page);
  });

  test("upload deck to ArkhamDB", async ({ page }) => {
    await connectArkhamDB(page);
    await uploadArkhamDBDeck(page);
    await cleanupDeck(page);
  });

  test("create ArkhamDB deck", async ({ page }) => {
    await connectArkhamDB(page);

    await page.goto("/deck/create/01002");
    await page.getByTestId("create-provider").selectOption("arkhamdb");
    await page.getByTestId("create-save").click();
    await fillSearch(page, "Abyssal Tome");
    await adjustListCardQuantity(page, "07159", "increment");
    await adjustListCardQuantity(page, "07159", "increment");

    await page.getByTestId("editor-save").click();
    const page1Promise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "View on ArkhamDB" }).click();
    const page1 = await page1Promise;

    await expect(page1.locator("#deck")).toContainText("2x Abyssal Tome ••", {
      timeout: 30000,
    });
    await expect(page1.locator("#deck")).toContainText("Daisy Walker");
    await page1.close();

    await cleanupDeck(page);
  });

  test("delete ArkhamDB deck", async ({ page }) => {
    await connectArkhamDB(page);
    const url = await uploadArkhamDBDeck(page);
    await cleanupDeck(page);
    await page.goto(url);
    await expect(page.getByRole("alert")).toContainText(
      "This deck doesn't exist.",
    );
  });

  test("upgrade ArkhamDB deck", async ({ page }) => {
    await connectArkhamDB(page);
    await uploadArkhamDBDeck(page);
    await page.getByTestId("view-upgrade").click();
    await page.getByTestId("upgrade-xp").fill("10");
    await page.getByTestId("upgrade-save").click();
    await page.getByTestId("editor-save").click();

    const page1Promise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "View on ArkhamDB" }).click();
    const page1 = await page1Promise;
    await expect(page1.locator("#upgrade_changes")).toContainText(
      "Available experience: 10",
    );

    await page1.close();
    await cleanupDeck(page);
  });

  test("sync ArkhamDB changes", async ({ page }) => {
    await connectArkhamDB(page);
    await page.goto(process.env.VITE_ARKHAMDB_BASE_URL as string);
    await page.getByRole("link", { name: "My Decks" }).click();
    await login(page);
    await page.getByRole("link", { name: "My Decks" }).click();
    await page.getByRole("link", { name: " Build New Deck" }).click();
    await page.getByRole("button", { name: "Create Agnes Baker Deck" }).click();
    await page.getByRole("button", { name: "Save" }).click();

    await page.goto("/");
    await expect(page.getByTestId("deck-summary-title")).not.toBeVisible();
    await page.getByRole("button", { name: "Sync" }).click();
    await expect(page.getByTestId("deck-summary-title")).toContainText(
      "The Agnes Baker Mysteries",
    );

    await page.getByTestId("collection-deck").click();
    await cleanupDeck(page);
  });

  test("connect ArkhamDB account in different language", async ({ page }) => {
    await page.getByLabel("Language").selectOption("de");
    await page.getByTestId("settings-save").click();
    await expect(page.locator("form")).toContainText("Verbinden");
    await page.getByRole("link", { name: "Verbinden" }).click();
    await arkhamDBOAuthFlow(page);
    await expect(page.getByTestId("connection-status")).toContainText(
      "Verbunden",
    );
  });
});

async function arkhamDBOAuthFlow(page: Page) {
  // login if not already logged in
  if (page.url().includes("login")) {
    await login(page);
  }

  await page.getByRole("button", { name: "Allow" }).click();
}

async function login(page: Page) {
  await page
    .getByRole("textbox", { name: "Username" })
    .fill(process.env.ARKHAMDB_USERNAME as string);

  await page
    .getByRole("textbox", { name: "Password" })
    .fill(process.env.ARKHAMDB_PASSWORD as string);

  await page.getByRole("button", { name: "Log In" }).click();
}

async function connectArkhamDB(page: Page) {
  await page.getByRole("link", { name: "Connect" }).click();
  await arkhamDBOAuthFlow(page);
  await expect(page.getByTestId("connection-status")).toContainText(
    "Connected",
  );
}

async function uploadArkhamDBDeck(page: Page) {
  // Import a deck
  await importDeckFromFile(page, "./deck_description.json", {
    navigate: "view",
  });

  // Add 2x .32 colt
  await page.getByTestId("view-edit").click();
  await fillSearch(page, ".32 Colt");
  await adjustListCardQuantity(page, "03020", "increment");
  await adjustListCardQuantity(page, "03020", "increment");
  await page.getByTestId("editor-save").click();

  // Upload to ArkhamDB
  await page.getByTestId("view-more-actions").click();
  await page.getByRole("dialog").getByTestId("view-upload").click();

  // Verify deck has cards
  const arkhamDBPagePromise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "View on ArkhamDB" }).click();
  const arkhamDBPage = await arkhamDBPagePromise;
  await expect(arkhamDBPage.locator("h1")).toContainText("deck notes test");
  await expect(arkhamDBPage.getByText("2x .32 Colt")).toBeVisible({
    timeout: 30000,
  });

  const url = arkhamDBPage.url();

  // Close the ArkhamDB page
  await arkhamDBPage.close();

  return url;
}

async function cleanupDeck(page: Page) {
  await page.getByTestId("view-more-actions").click();
  page.once("dialog", (dialog) => {
    dialog.accept().catch(() => {});
  });

  await page.getByTestId("view-delete").click();
  await expect(page.getByTestId("deck-summary-title")).not.toBeVisible();
}
