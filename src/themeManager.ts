import * as vscode from "vscode"
import { ColorPalette, type NeonTheme } from "./colorPalette"
import { Logger } from "./utils/logger"

export class ThemeManager {
  private context: vscode.ExtensionContext
  private currentTheme: NeonTheme | undefined
  private autoSwitchTimer: NodeJS.Timer | undefined

  constructor(context: vscode.ExtensionContext) {
    this.context = context
    this.loadCurrentTheme()
  }

  private async loadCurrentTheme(): Promise<void> {
    try {
      const currentThemeName = vscode.workspace.getConfiguration().get("workbench.colorTheme") as string
      if (currentThemeName.includes("Neon")) {
        this.currentTheme = ColorPalette.getThemeByName(currentThemeName)
      }
    } catch (error) {
      Logger.error("Failed to load current theme", error)
    }
  }

  public async applyTheme(themeName: string): Promise<void> {
    try {
      const theme = ColorPalette.getThemeByName(themeName)
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
      Logger.error(`Failed to apply theme: ${themeName}`, error)
      throw error
    }
  }

  public async applyCustomColors(colors: Record<string, string>): Promise<void> {
    try {
      const config = vscode.workspace.getConfiguration("neonThemes")
      await config.update("customColors", colors, vscode.ConfigurationTarget.Global)
      await this.applyCustomizations()

      Logger.info("Applied custom colors")
    } catch (error) {
      Logger.error("Failed to apply custom colors", error)
      throw error
    }
  }

  private async applyCustomizations(): Promise<void> {
    const config = vscode.workspace.getConfiguration("neonThemes")
    const customColors = config.get("customColors") as Record<string, string>
    const enableGlow = config.get("enableGlow") as boolean
    const glowIntensity = config.get("glowIntensity") as number

    if (Object.keys(customColors).length > 0 || enableGlow) {
      await this.applyCSSCustomizations(enableGlow, glowIntensity)
    }
  }

  private async applyCSSCustomizations(enableGlow: boolean, intensity: number): Promise<void> {
    if (!enableGlow) return

    const css = this.generateGlowCSS(intensity)
    Logger.info("Applied CSS customizations")
  }

  private generateGlowCSS(intensity: number): string {
    return `
      .mtk1, .mtk2, .mtk3, .mtk4, .mtk5, .mtk6, .mtk7, .mtk8, .mtk9, .mtk10 {
        text-shadow: 0 0 ${intensity * 10}px currentColor;
      }
    `
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

  public onConfigurationChanged(): void {
    const config = vscode.workspace.getConfiguration("neonThemes")
    const autoSwitch = config.get("autoSwitchTheme") as boolean

    if (autoSwitch) {
      this.enableAutoSwitch()
    } else {
      this.disableAutoSwitch()
    }

    this.applyCustomizations()
  }

  public getCurrentTheme(): NeonTheme | undefined {
    return this.currentTheme
  }

  public getAvailableThemes(): string[] {
    return ColorPalette.getAllThemeNames()
  }

  // Adds a method to toggle the DNA background effect
  public async toggleDNABackground(): Promise<void> {
    const config = vscode.workspace.getConfiguration("neonThemes")
    const current = config.get("dnaBackgroundEnabled") as boolean
    await config.update("dnaBackgroundEnabled", !current, vscode.ConfigurationTarget.Global)
    Logger.info(`DNA background toggled to: ${!current}`)
  }

  // Adds a method to cycle through DNA patterns
  public async cycleDNAPattern(): Promise<void> {
    const config = vscode.workspace.getConfiguration("neonThemes")
    const patterns = ["pattern1", "pattern2", "pattern3"]
    let current = config.get("dnaPattern") as string
    const idx = patterns.indexOf(current)
    const nextPattern = patterns[(idx + 1) % patterns.length]
    await config.update("dnaPattern", nextPattern, vscode.ConfigurationTarget.Global)
    Logger.info(`Cycled DNA pattern to: ${nextPattern}`)
  }
}
