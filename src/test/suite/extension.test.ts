import * as assert from "assert"
import * as vscode from "vscode"
import { ColorPalette } from "../../colorPalette"
import { ThemeManager } from "../../themeManager"

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.")

  test("ColorPalette should have predefined themes", () => {
    const themes = ColorPalette.getAllThemes()
    assert.strictEqual(themes.length >= 4, true, "Should have at least 4 predefined themes")

    const themeNames = ColorPalette.getAllThemeNames()
    assert.strictEqual(themeNames.includes("Neon Cyber"), true, "Should include Neon Cyber theme")
    assert.strictEqual(themeNames.includes("Electric Blue"), true, "Should include Electric Blue theme")
  })

  test("ColorPalette should retrieve theme by name", () => {
    const theme = ColorPalette.getThemeByName("Neon Cyber")
    assert.strictEqual(theme !== undefined, true, "Should retrieve Neon Cyber theme")
    assert.strictEqual(theme?.displayName, "Neon Cyber", "Theme display name should match")
  })

  test("ColorPalette should generate color variations", () => {
    const variations = ColorPalette.generateColorVariations("#ff0080", 5)
    assert.strictEqual(variations.length, 5, "Should generate 5 color variations")
    assert.strictEqual(
      variations.every((color) => /^#[0-9a-fA-F]{6}$/.test(color)),
      true,
      "All variations should be valid hex colors",
    )
  })

  test("ColorPalette should create custom theme", () => {
    const customTheme = ColorPalette.createCustomTheme("Test Theme", {
      background: "#000000",
      foreground: "#ffffff",
    })

    assert.strictEqual(customTheme.displayName, "Test Theme", "Custom theme should have correct display name")
    assert.strictEqual(customTheme.colors.background, "#000000", "Custom theme should use provided background color")
    assert.strictEqual(customTheme.colors.foreground, "#ffffff", "Custom theme should use provided foreground color")
  })

  test("ThemeManager should initialize correctly", () => {
    const context = {
      subscriptions: [],
      extensionUri: vscode.Uri.file("/test"),
      globalState: {
        get: () => undefined,
        update: () => Promise.resolve(),
      },
    } as any

    const themeManager = new ThemeManager(context)
    assert.strictEqual(themeManager !== undefined, true, "ThemeManager should initialize")

    const availableThemes = themeManager.getAvailableThemes()
    assert.strictEqual(availableThemes.length >= 4, true, "Should have available themes")
  })
})
