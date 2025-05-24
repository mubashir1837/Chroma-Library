"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
const colorPalette_1 = require("../../colorPalette");
const themeManager_1 = require("../../themeManager");
suite("Extension Test Suite", () => {
    vscode.window.showInformationMessage("Start all tests.");
    test("ColorPalette should have predefined themes", () => {
        const themes = colorPalette_1.ColorPalette.getAllThemes();
        assert.strictEqual(themes.length >= 4, true, "Should have at least 4 predefined themes");
        const themeNames = colorPalette_1.ColorPalette.getAllThemeNames();
        assert.strictEqual(themeNames.includes("Neon Cyber"), true, "Should include Neon Cyber theme");
        assert.strictEqual(themeNames.includes("Electric Blue"), true, "Should include Electric Blue theme");
    });
    test("ColorPalette should retrieve theme by name", () => {
        const theme = colorPalette_1.ColorPalette.getThemeByName("Neon Cyber");
        assert.strictEqual(theme !== undefined, true, "Should retrieve Neon Cyber theme");
        assert.strictEqual(theme?.displayName, "Neon Cyber", "Theme display name should match");
    });
    test("ColorPalette should generate color variations", () => {
        const variations = colorPalette_1.ColorPalette.generateColorVariations("#ff0080", 5);
        assert.strictEqual(variations.length, 5, "Should generate 5 color variations");
        assert.strictEqual(variations.every((color) => /^#[0-9a-fA-F]{6}$/.test(color)), true, "All variations should be valid hex colors");
    });
    test("ColorPalette should create custom theme", () => {
        const customTheme = colorPalette_1.ColorPalette.createCustomTheme("Test Theme", {
            background: "#000000",
            foreground: "#ffffff",
        });
        assert.strictEqual(customTheme.displayName, "Test Theme", "Custom theme should have correct display name");
        assert.strictEqual(customTheme.colors.background, "#000000", "Custom theme should use provided background color");
        assert.strictEqual(customTheme.colors.foreground, "#ffffff", "Custom theme should use provided foreground color");
    });
    test("ThemeManager should initialize correctly", () => {
        const context = {
            subscriptions: [],
            extensionUri: vscode.Uri.file("/test"),
            globalState: {
                get: () => undefined,
                update: () => Promise.resolve(),
            },
        };
        const themeManager = new themeManager_1.ThemeManager(context);
        assert.strictEqual(themeManager !== undefined, true, "ThemeManager should initialize");
        const availableThemes = themeManager.getAvailableThemes();
        assert.strictEqual(availableThemes.length >= 4, true, "Should have available themes");
    });
});
//# sourceMappingURL=extension.test.js.map