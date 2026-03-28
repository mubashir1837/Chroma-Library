import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import { ThemeRegistry } from "./themeRegistry"
import { GradientManager } from "./gradientManager"
import { AnimationManager } from "./animationManager"
import { DNABackgroundManager, type DNABackgroundConfig } from "./dnaBackgroundManager"
import { Logger } from "../utils/logger"
import { ErrorHandler } from "../utils/errorHandler"
import type { NeonTheme, ThemeCategory } from "../types/theme"

export class ThemeManager {
  private context: vscode.ExtensionContext
  private themeRegistry: ThemeRegistry
  private gradientManager: GradientManager
  private animationManager: AnimationManager
  private dnaBackgroundManager: DNABackgroundManager
  private currentTheme: NeonTheme | undefined
  private autoSwitchTimer: NodeJS.Timer | undefined

  constructor(context: vscode.ExtensionContext) {
    this.context = context
    this.themeRegistry = new ThemeRegistry()
    this.gradientManager = new GradientManager()
    this.animationManager = new AnimationManager()
    this.dnaBackgroundManager = new DNABackgroundManager()
    this.initialization = this.loadCurrentTheme().then(() => this.applyCustomizations())
  }

  private initialization: Promise<void>

  private async loadCurrentTheme(): Promise<void> {
    try {
      const currentThemeName = vscode.workspace.getConfiguration().get("workbench.colorTheme") as string
      let foundTheme = this.themeRegistry.getThemeByName(currentThemeName)
      if (!foundTheme) {
        foundTheme = this.themeRegistry.getAllThemes().find(t => t.displayName === currentThemeName)
      }
      this.currentTheme = foundTheme
    } catch (error) {
      ErrorHandler.handleError("Failed to load current theme", error)
    }
  }

  public async applyTheme(themeName: string): Promise<void> {
    await this.initialization
    try {
      const theme = this.themeRegistry.getThemeByName(themeName)
      if (!theme) {
        throw new Error(`Theme ${themeName} not found`)
      }

      await vscode.workspace
        .getConfiguration()
        .update("workbench.colorTheme", themeName, vscode.ConfigurationTarget.Global)

      this.currentTheme = theme
      await this.applyCustomizations()

      Logger.info(`Applied theme: ${themeName}`)
    } catch (error) {
      ErrorHandler.handleError(`Failed to apply theme: ${themeName}`, error)
      throw error
    }
  }

  public async applyCustomColors(colors: Record<string, string>): Promise<void> {
    await this.initialization
    try {
      const config = vscode.workspace.getConfiguration("neonThemes")
      await config.update("customColors", colors, vscode.ConfigurationTarget.Global)
      await this.applyCustomizations()

      Logger.info("Applied custom colors")
    } catch (error) {
      ErrorHandler.handleError("Failed to apply custom colors", error)
      throw error
    }
  }

  private async applyCustomizations(): Promise<void> {
    const config = vscode.workspace.getConfiguration("neonThemes")
    const customColors = config.get("customColors") as Record<string, string>
    const enableGlow = config.get("enableGlow") as boolean
    const glowIntensity = config.get("glowIntensity") as number
    const enableDNABackground = config.get("dnaBackground.enabled") as boolean

    let css = ""

    // Apply glow effects
    if (enableGlow) {
      css += this.generateGlowCSS(glowIntensity)
    }

    // Apply DNA background for DNA Helix & Futuristic Bio themes
    const isBioTheme = this.currentTheme?.name.includes("DNA Helix") || 
                       this.currentTheme?.name.includes("Futuristic Bio") ||
                       this.currentTheme?.displayName.includes("Futuristic Bio");

    if (enableDNABackground && isBioTheme) {
      const dnaConfig = this.getDNABackgroundConfig()
      css += this.dnaBackgroundManager.generateDNABackgroundCSS(dnaConfig)
    }

    // Always apply CSS to overwrite old rules if disabled
    await this.applyCSSCustomizations(css)
  }

  private getDNABackgroundConfig(): DNABackgroundConfig {
    const config = vscode.workspace.getConfiguration("neonThemes.dnaBackground")
    const defaultConfig = this.dnaBackgroundManager.getDefaultConfig()

    const isFuturisticBio = this.currentTheme?.name.includes("Futuristic Bio") || 
                            this.currentTheme?.displayName.includes("Futuristic Bio") ||
                            (vscode.workspace.getConfiguration().get("workbench.colorTheme") as string).includes("Futuristic Bio");

    return {
      enabled: config.get("enabled", true), // Default to true if not set
      pattern: config.get("pattern", (isFuturisticBio ? "random" : defaultConfig.pattern)),
      opacity: config.get("opacity", (isFuturisticBio ? 0.2 : defaultConfig.opacity)), // Higher opacity for Futuristic Bio by default
      size: config.get("size", defaultConfig.size),
      spacing: config.get("spacing", (isFuturisticBio ? 40 : defaultConfig.spacing)),
      color: config.get("color", defaultConfig.color),
      useEmoji: config.get("useEmoji", defaultConfig.useEmoji),
    }
  }

  private async applyCSSCustomizations(css: string): Promise<void> {
    try {
      // Save CSS to extension global storage
      const storageUri = this.context.globalStorageUri;
      if (!fs.existsSync(storageUri.fsPath)) {
        fs.mkdirSync(storageUri.fsPath, { recursive: true });
      }

      const cssPath = path.join(storageUri.fsPath, "chroma-background.css");
      fs.writeFileSync(cssPath, css, "utf8");

      const config = vscode.workspace.getConfiguration();
      const fileUri = vscode.Uri.file(cssPath).toString();

      // Support for Apc Customize UI
      let apcImports = config.get<string[]>("apc.imports") || [];
      if (!apcImports.includes(fileUri)) {
        apcImports = apcImports.filter(i => !i.includes("chroma-background.css"));
        apcImports.push(fileUri);
        await config.update("apc.imports", apcImports, vscode.ConfigurationTarget.Global);
      }

      // Support for Custom CSS and JS Loader
      let customCssImports = config.get<string[]>("vscode_custom_css.imports") || [];
      if (!customCssImports.includes(fileUri)) {
        customCssImports = customCssImports.filter((i: string) => !i.includes("chroma-background.css"));
        customCssImports.push(fileUri);
        await config.update("vscode_custom_css.imports", customCssImports, vscode.ConfigurationTarget.Global);
      }

      vscode.window.showInformationMessage("Chroma CSS updated! (Requires 'Apc Customize UI' or 'Custom CSS & JS Loader' to take effect. You may need to Reload Window).", "Reload Window").then(selection => {
        if (selection === "Reload Window") {
          vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
      });

      Logger.info("Applied CSS customizations including DNA background");
    } catch (error) {
      ErrorHandler.handleError("Failed to apply CSS customizations", error);
    }
  }

  private generateGlowCSS(intensity: number): string {
    return `
      /* Neon Glow Effects */
      .mtk1, .mtk2, .mtk3, .mtk4, .mtk5, .mtk6, .mtk7, .mtk8, .mtk9, .mtk10 {
        text-shadow: 0 0 ${intensity * 10}px currentColor;
      }
      
      /* Enhanced glow for DNA theme */
      .monaco-editor.dna-theme .mtk1 {
        text-shadow: 0 0 ${intensity * 8}px #3742fa, 0 0 ${intensity * 15}px #3742fa40;
      }
      
      .monaco-editor.dna-theme .mtk2 {
        text-shadow: 0 0 ${intensity * 8}px #ff4757, 0 0 ${intensity * 15}px #ff475740;
      }
      
      .monaco-editor.dna-theme .mtk3 {
        text-shadow: 0 0 ${intensity * 8}px #00ff99, 0 0 ${intensity * 15}px #00ff9940;
      }
      
      .monaco-editor.dna-theme .mtk4 {
        text-shadow: 0 0 ${intensity * 8}px #ffa502, 0 0 ${intensity * 15}px #ffa50240;
      }
    `
  }

  public async toggleDNABackground(): Promise<void> {
    await this.initialization
    try {
      const config = vscode.workspace.getConfiguration("neonThemes.dnaBackground")
      const currentValue = config.get("enabled") as boolean
      await config.update("enabled", !currentValue, vscode.ConfigurationTarget.Global)

      const status = !currentValue ? "enabled" : "disabled"
      vscode.window.showInformationMessage(`🧬 DNA background motif ${status}`)

      await this.applyCustomizations()
    } catch (error) {
      ErrorHandler.handleError("Failed to toggle DNA background", error)
      throw error
    }
  }

  public async cycleDNAPattern(): Promise<void> {
    await this.initialization
    try {
      const config = vscode.workspace.getConfiguration("neonThemes.dnaBackground")
      const currentPattern = config.get("pattern") as string
      const patterns = ["grid", "random", "helix"]
      const currentIndex = patterns.indexOf(currentPattern)
      const nextPattern = patterns[(currentIndex + 1) % patterns.length]

      await config.update("pattern", nextPattern, vscode.ConfigurationTarget.Global)
      vscode.window.showInformationMessage(`🧬 DNA pattern changed to: ${nextPattern}`)

      await this.applyCustomizations()
    } catch (error) {
      ErrorHandler.handleError("Failed to cycle DNA pattern", error)
      throw error
    }
  }

  public enableAutoSwitch(): void {
    this.disableAutoSwitch()

    this.autoSwitchTimer = setInterval(() => {
      this.checkTimeBasedTheme()
    }, 60000)

    this.checkTimeBasedTheme()
  }

  public disableAutoSwitch(): void {
    if (this.autoSwitchTimer) {
      clearInterval(this.autoSwitchTimer)
      this.autoSwitchTimer = undefined
    }
  }

  private async checkTimeBasedTheme(): Promise<void> {
    const hour = new Date().getHours()
    let themeName: string

    if (hour >= 6 && hour < 12) {
      themeName = "Electric Blue"
    } else if (hour >= 12 && hour < 18) {
      themeName = "Quantum Green"
    } else if (hour >= 18 && hour < 22) {
      themeName = "Plasma Pink"
    } else {
      themeName = "Neon Cyber"
    }

    const currentTheme = vscode.workspace.getConfiguration().get("workbench.colorTheme") as string
    if (currentTheme !== themeName) {
      await this.applyTheme(themeName)
    }
  }

  public async resetToDefault(): Promise<void> {
    const config = vscode.workspace.getConfiguration("neonThemes")
    await config.update("customColors", {}, vscode.ConfigurationTarget.Global)
    await this.applyTheme("Neon Cyber")
  }

  public async onConfigurationChanged(): Promise<void> {
    await this.initialization
    const config = vscode.workspace.getConfiguration("neonThemes")
    const autoSwitch = config.get("autoSwitchTheme") as boolean

    if (autoSwitch) {
      this.enableAutoSwitch()
    } else {
      this.disableAutoSwitch()
    }

    await this.applyCustomizations()
  }

  public getCurrentTheme(): NeonTheme | undefined {
    return this.currentTheme
  }

  public getAvailableThemes(): string[] {
    return this.themeRegistry.getAllThemeNames()
  }

  public getThemesByCategory(category: ThemeCategory): NeonTheme[] {
    return this.themeRegistry.getThemesByCategory(category)
  }

  public getThemeRegistry(): ThemeRegistry {
    return this.themeRegistry
  }

  public getDNABackgroundManager(): DNABackgroundManager {
    return this.dnaBackgroundManager
  }
}
