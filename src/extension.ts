import * as vscode from "vscode"
import { ThemeManager } from "./themeManager"
import { CustomizerPanel } from "./customizerPanel"
import { ThemeExporter } from "./themeExporter"
import { Logger } from "./utils/logger"

let themeManager: ThemeManager
let customizerPanel: CustomizerPanel | undefined

export function activate(context: vscode.ExtensionContext) {
  Logger.info("Neon Futuristic Themes extension is now active")

  // Initialize theme manager
  themeManager = new ThemeManager(context)

  // Register commands
  const commands = [
    vscode.commands.registerCommand("neonThemes.openCustomizer", () => {
      if (customizerPanel) {
        customizerPanel.reveal()
      } else {
        customizerPanel = new CustomizerPanel(context.extensionUri, themeManager)
        customizerPanel.onDidDispose(() => {
          customizerPanel = undefined
        })
      }
    }),

    vscode.commands.registerCommand("neonThemes.exportTheme", async () => {
      try {
        const exporter = new ThemeExporter()
        await exporter.exportCurrentTheme()
        vscode.window.showInformationMessage("Theme exported successfully!")
      } catch (error) {
        Logger.error("Failed to export theme", error)
        vscode.window.showErrorMessage("Failed to export theme")
      }
    }),

    vscode.commands.registerCommand("neonThemes.importTheme", async () => {
      try {
        const exporter = new ThemeExporter()
        await exporter.importTheme()
        vscode.window.showInformationMessage("Theme imported successfully!")
      } catch (error) {
        Logger.error("Failed to import theme", error)
        vscode.window.showErrorMessage("Failed to import theme")
      }
    }),

    vscode.commands.registerCommand("neonThemes.resetTheme", async () => {
      try {
        await themeManager.resetToDefault()
        vscode.window.showInformationMessage("Theme reset to default")
      } catch (error) {
        Logger.error("Failed to reset theme", error)
        vscode.window.showErrorMessage("Failed to reset theme")
      }
    }),

    vscode.commands.registerCommand("neonThemes.toggleGradients", async () => {
      try {
        const config = vscode.workspace.getConfiguration("neonThemes")
        const currentValue = config.get("enableGradients") as boolean
        await config.update("enableGradients", !currentValue, vscode.ConfigurationTarget.Global)

        const status = !currentValue ? "enabled" : "disabled"
        vscode.window.showInformationMessage(`Gradient backgrounds ${status}`)

        // Apply the change immediately
        await themeManager.onConfigurationChanged()
      } catch (error) {
        Logger.error("Failed to toggle gradients", error)
        vscode.window.showErrorMessage("Failed to toggle gradients")
      }
    }),

    vscode.commands.registerCommand("neonThemes.activateBioTheme", async () => {
      try {
        await themeManager.applyTheme("DNA Helix 🧬")

        // Enable bio mode and DNA background
        const config = vscode.workspace.getConfiguration("neonThemes")
        await config.update("bioMode", true, vscode.ConfigurationTarget.Global)
        await config.update("dnaBackground.enabled", true, vscode.ConfigurationTarget.Global)

        vscode.window
          .showInformationMessage(
            "🧬 DNA Helix theme activated with molecular background! Perfect for bioinformatics work.",
            "Customize DNA Background",
            "Learn More",
          )
          .then((selection) => {
            if (selection === "Customize DNA Background") {
              vscode.commands.executeCommand("workbench.action.openSettings", "neonThemes.dnaBackground")
            } else if (selection === "Learn More") {
              vscode.env.openExternal(vscode.Uri.parse("https://github.com/your-repo/neon-themes#bioinformatics"))
            }
          })
      } catch (error) {
        Logger.error("Failed to activate DNA Helix theme", error)
        vscode.window.showErrorMessage("Failed to activate DNA Helix theme")
      }
    }),

    vscode.commands.registerCommand("neonThemes.toggleDNABackground", async () => {
      try {
        await themeManager.toggleDNABackground()
      } catch (error) {
        Logger.error("Failed to toggle DNA background", error)
        vscode.window.showErrorMessage("Failed to toggle DNA background")
      }
    }),

    vscode.commands.registerCommand("neonThemes.cycleDNAPattern", async () => {
      try {
        await themeManager.cycleDNAPattern()
      } catch (error) {
        Logger.error("Failed to cycle DNA pattern", error)
        vscode.window.showErrorMessage("Failed to cycle DNA pattern")
      }
    }),
  ]

  // Add commands to subscriptions
  commands.forEach((command) => context.subscriptions.push(command))

  // Initialize auto-switching if enabled
  const config = vscode.workspace.getConfiguration("neonThemes")
  if (config.get("autoSwitchTheme")) {
    themeManager.enableAutoSwitch()
  }

  // Watch for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("neonThemes")) {
        themeManager.onConfigurationChanged()
      }
    }),
  )

  // Show welcome message for DNA theme users
  const currentTheme = vscode.workspace.getConfiguration().get("workbench.colorTheme") as string
  if (currentTheme === "DNA Helix 🧬") {
    const dnaEnabled = config.get("dnaBackground.enabled") as boolean
    if (!dnaEnabled) {
      vscode.window
        .showInformationMessage(
          "🧬 DNA Helix theme detected! Enable DNA background motif for the full scientific experience?",
          "Enable DNA Background",
          "Not Now",
        )
        .then((selection) => {
          if (selection === "Enable DNA Background") {
            vscode.commands.executeCommand("neonThemes.toggleDNABackground")
          }
        })
    }
  }

  Logger.info("Extension activation completed with 10 neon themes including DNA Helix with molecular backgrounds! 🧬")
}

export function deactivate() {
  if (customizerPanel) {
    customizerPanel.dispose()
  }
  Logger.info("Extension deactivated")
}