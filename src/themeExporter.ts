import * as vscode from "vscode"
import { ColorPalette, type NeonTheme } from "./colorPalette"
import { Logger } from "./utils/logger"

export class ThemeExporter {
  public async exportCurrentTheme(): Promise<void> {
    const currentThemeName = vscode.workspace.getConfiguration().get("workbench.colorTheme") as string
    const theme = ColorPalette.getThemeByName(currentThemeName)

    if (!theme) {
      throw new Error("Current theme is not a Neon theme")
    }

    const uri = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file(`${theme.name}.json`),
      filters: {
        "JSON files": ["json"],
      },
    })

    if (uri) {
      const themeData = this.convertToVSCodeTheme(theme)
      await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify(themeData, null, 2)))
      Logger.info(`Theme exported to: ${uri.fsPath}`)
    }
  }

  public async importTheme(): Promise<void> {
    const uri = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        "JSON files": ["json"],
      },
    })

    if (uri && uri[0]) {
      const content = await vscode.workspace.fs.readFile(uri[0])
      const themeData = JSON.parse(content.toString())

      // Validate and convert theme data
      const neonTheme = this.convertFromVSCodeTheme(themeData)

      // Add to available themes (in a real implementation, you'd save this persistently)
      Logger.info(`Theme imported from: ${uri[0].fsPath}`)
    }
  }

  private convertToVSCodeTheme(theme: NeonTheme): any {
    return {
      name: theme.displayName,
      type: "dark",
      colors: {
        "editor.background": theme.colors.background,
        "editor.foreground": theme.colors.foreground,
        "editor.selectionBackground": theme.colors.selection,
        "editor.lineHighlightBackground": theme.colors.lineHighlight,
        "editorCursor.foreground": theme.colors.cursor,

        "sideBar.background": theme.colors.sidebarBackground,
        "sideBar.foreground": theme.colors.sidebarForeground,
        "activityBar.background": theme.colors.activityBarBackground,
        "activityBar.foreground": theme.colors.activityBarForeground,
        "statusBar.background": theme.colors.statusBarBackground,
        "statusBar.foreground": theme.colors.statusBarForeground,
        "titleBar.activeBackground": theme.colors.titleBarBackground,
        "titleBar.activeForeground": theme.colors.titleBarForeground,

        "menu.background": theme.colors.menuBackground,
        "menu.foreground": theme.colors.menuForeground,

        "button.background": theme.colors.primary,
        "button.foreground": theme.colors.background,
        focusBorder: theme.colors.primary,
        "selection.background": theme.colors.selection,

        errorForeground: theme.colors.error,
        warningForeground: theme.colors.warning,
        infoForeground: theme.colors.info,
      },
      tokenColors: [
        {
          scope: ["keyword", "storage.type", "storage.modifier"],
          settings: { foreground: theme.colors.keyword },
        },
        {
          scope: ["string"],
          settings: { foreground: theme.colors.string },
        },
        {
          scope: ["constant.numeric"],
          settings: { foreground: theme.colors.number },
        },
        {
          scope: ["comment"],
          settings: { foreground: theme.colors.comment },
        },
        {
          scope: ["entity.name.function"],
          settings: { foreground: theme.colors.function },
        },
        {
          scope: ["variable"],
          settings: { foreground: theme.colors.variable },
        },
        {
          scope: ["entity.name.type", "support.type"],
          settings: { foreground: theme.colors.type },
        },
        {
          scope: ["entity.name.class"],
          settings: { foreground: theme.colors.class },
        },
        {
          scope: ["entity.name.interface"],
          settings: { foreground: theme.colors.interface },
        },
        {
          scope: ["constant.language"],
          settings: { foreground: theme.colors.constant },
        },
        {
          scope: ["keyword.operator"],
          settings: { foreground: theme.colors.operator },
        },
        {
          scope: ["punctuation"],
          settings: { foreground: theme.colors.punctuation },
        },
        {
          scope: ["meta.brace"],
          settings: { foreground: theme.colors.bracket },
        },
        {
          scope: ["entity.name.tag"],
          settings: { foreground: theme.colors.tag },
        },
        {
          scope: ["entity.other.attribute-name"],
          settings: { foreground: theme.colors.attribute },
        },
      ],
    }
  }

  private convertFromVSCodeTheme(themeData: any): NeonTheme {
    // This is a simplified conversion - in a real implementation,
    // you'd need more sophisticated mapping logic
    return {
      name: themeData.name.toLowerCase().replace(/\s+/g, "-"),
      displayName: themeData.name,
      colors: {
        background: themeData.colors["editor.background"] || "#0a0a0f",
        foreground: themeData.colors["editor.foreground"] || "#e0e0ff",
        selection: themeData.colors["editor.selectionBackground"] || "#ff00ff40",
        lineHighlight: themeData.colors["editor.lineHighlightBackground"] || "#1a1a2e",
        cursor: themeData.colors["editorCursor.foreground"] || "#00ffff",

        // Extract token colors and map to our structure
        keyword: this.extractTokenColor(themeData.tokenColors, "keyword") || "#ff0080",
        string: this.extractTokenColor(themeData.tokenColors, "string") || "#00ff80",
        number: this.extractTokenColor(themeData.tokenColors, "constant.numeric") || "#80ff00",
        comment: this.extractTokenColor(themeData.tokenColors, "comment") || "#666699",
        function: this.extractTokenColor(themeData.tokenColors, "entity.name.function") || "#00ffff",
        variable: this.extractTokenColor(themeData.tokenColors, "variable") || "#ffff00",
        type: this.extractTokenColor(themeData.tokenColors, "entity.name.type") || "#ff8000",
        class: this.extractTokenColor(themeData.tokenColors, "entity.name.class") || "#8000ff",
        interface: this.extractTokenColor(themeData.tokenColors, "entity.name.interface") || "#ff0040",
        enum: "#40ff00",
        constant: this.extractTokenColor(themeData.tokenColors, "constant.language") || "#ff4000",
        operator: this.extractTokenColor(themeData.tokenColors, "keyword.operator") || "#00ff40",
        punctuation: this.extractTokenColor(themeData.tokenColors, "punctuation") || "#c0c0c0",
        bracket: this.extractTokenColor(themeData.tokenColors, "meta.brace") || "#ff00c0",
        tag: this.extractTokenColor(themeData.tokenColors, "entity.name.tag") || "#c000ff",
        attribute: this.extractTokenColor(themeData.tokenColors, "entity.other.attribute-name") || "#00c0ff",
        value: "#ffc000",
        entity: "#0080ff",
        support: "#80ff80",
        storage: "#ff8080",

        sidebarBackground: themeData.colors["sideBar.background"] || "#0f0f1a",
        sidebarForeground: themeData.colors["sideBar.foreground"] || "#c0c0ff",
        activityBarBackground: themeData.colors["activityBar.background"] || "#050508",
        activityBarForeground: themeData.colors["activityBar.foreground"] || "#8080ff",
        statusBarBackground: themeData.colors["statusBar.background"] || "#1a0a1a",
        statusBarForeground: themeData.colors["statusBar.foreground"] || "#ff80ff",
        titleBarBackground: themeData.colors["titleBar.activeBackground"] || "#0a0a0f",
        titleBarForeground: themeData.colors["titleBar.activeForeground"] || "#e0e0ff",
        menuBackground: themeData.colors["menu.background"] || "#1a1a2e",
        menuForeground: themeData.colors["menu.foreground"] || "#e0e0ff",

        primary: themeData.colors["button.background"] || "#ff00ff",
        secondary: "#00ffff",
        tertiary: "#ffff00",
        success: "#00ff00",
        warning: themeData.colors["warningForeground"] || "#ffff00",
        error: themeData.colors["errorForeground"] || "#ff0000",
        info: themeData.colors["infoForeground"] || "#0080ff",

        neonPink: "#ff1493",
        neonBlue: "#00bfff",
        neonGreen: "#39ff14",
        neonPurple: "#bf00ff",
        neonOrange: "#ff4500",
        neonYellow: "#ffff00",
      },
    }
  }

  private extractTokenColor(tokenColors: any[], scope: string): string | undefined {
    for (const token of tokenColors) {
      if (
        token.scope &&
        (token.scope.includes(scope) ||
          (Array.isArray(token.scope) && token.scope.some((s: string) => s.includes(scope))))
      ) {
        return token.settings?.foreground
      }
    }
    return undefined
  }
}
