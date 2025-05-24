"use strict";
shell;
;
`` `ts file="src/core/themeManager.ts"
[v0-no-op-code-block-prefix]import * as vscode from "vscode"
import { ThemeRegistry } from "./themeRegistry"
import { GradientManager } from "./gradientManager"
import { AnimationManager } from "./animationManager"
import { Logger } from "../utils/logger"
import { ErrorHandler } from "../utils/errorHandler"
import type { NeonTheme, ThemeCategory } from "../types/theme"

export class ThemeManager {
  private context: vscode.ExtensionContext
  private themeRegistry: ThemeRegistry
  private gradientManager: GradientManager
  private animationManager: AnimationManager
  private currentTheme: NeonTheme | undefined
  private autoSwitchTimer: NodeJS.Timer | undefined

  constructor(context: vscode.ExtensionContext) {
    this.context = context
    this.themeRegistry = new ThemeRegistry()
    this.gradientManager = new GradientManager()
    this.animationManager = new AnimationManager()
    this.loadCurrentTheme()
  }

  private async loadCurrentTheme(): Promise<void> {
    try {
      const currentThemeName = vscode.workspace.getConfiguration().get("workbench.colorTheme") as string
      if (currentThemeName.includes("Neon")) {
        this.currentTheme = this.themeRegistry.getThemeByName(currentThemeName)
      }
    } catch (error) {
      ErrorHandler.handleError("Failed to load current theme", error)
    }
  }

  public async applyTheme(themeName: string): Promise<void> {
    try {
      const theme = this.themeRegistry.getThemeByName(themeName)
      if (!theme) {
        throw new Error(`;
Theme;
$;
{
    themeName;
}
not;
found `)
      }

      await vscode.workspace
        .getConfiguration()
        .update("workbench.colorTheme", themeName, vscode.ConfigurationTarget.Global)

      this.currentTheme = theme
      await this.applyCustomizations()

      Logger.info(`;
Applied;
theme: $;
{
    themeName;
}
;
`)
    } catch (error) {
      ErrorHandler.handleError(`;
Failed;
to;
apply;
theme: $;
{
    themeName;
}
`, error)
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
      ErrorHandler.handleError("Failed to apply custom colors", error)
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
    .mtk1,
        .mtk2, .mtk3, .mtk4, .mtk5, .mtk6, .mtk7, .mtk8, .mtk9, .mtk10;
{
    text - shadow;
    0;
    0;
    $;
    intensity * 10;
    px;
    currentColor;
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
    return this.themeRegistry.getAllThemeNames()
  }

  public getThemesByCategory(category: ThemeCategory): NeonTheme[] {
    return this.themeRegistry.getThemesByCategory(category)
  }

  public getThemeRegistry(): ThemeRegistry {
    return this.themeRegistry
  }
}
;
//# sourceMappingURL=themeManagerPanel.js.map