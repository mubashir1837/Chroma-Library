import * as vscode from "vscode"
import type { ThemeManager } from "./themeManager"
import { ColorPalette } from "./colorPalette"
import { Logger } from "./utils/logger"

export class CustomizerPanel {
  public static readonly viewType = "neonThemes.customizer"
  private readonly panel: vscode.WebviewPanel
  private readonly extensionUri: vscode.Uri
  private readonly themeManager: ThemeManager
  private disposables: vscode.Disposable[] = []

  constructor(extensionUri: vscode.Uri, themeManager: ThemeManager) {
    this.extensionUri = extensionUri
    this.themeManager = themeManager

    this.panel = vscode.window.createWebviewPanel(
      CustomizerPanel.viewType,
      "Neon Theme Customizer",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(require("path").join(this.extensionUri.fsPath, "media")),
          vscode.Uri.file(require("path").join(this.extensionUri.fsPath, "out", "compiled")),
        ],
      },
    )

    this.update()
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables)

    this.panel.webview.onDidReceiveMessage(
      async (message: { type: string; [key: string]: any }) => {
        switch (message.type) {
          case "applyTheme":
            try {
              await this.themeManager.applyTheme(message.themeName)
              this.panel.webview.postMessage({
                type: "themeApplied",
                themeName: message.themeName,
              })
            } catch (error) {
              Logger.error("Failed to apply theme from customizer", error)
              this.panel.webview.postMessage({
                type: "error",
                message: "Failed to apply theme",
              })
            }
            break

          case "updateColors":
            try {
              await this.themeManager.applyCustomColors(message.colors)
              this.panel.webview.postMessage({
                type: "colorsUpdated",
              })
            } catch (error) {
              Logger.error("Failed to update colors from customizer", error)
              this.panel.webview.postMessage({
                type: "error",
                message: "Failed to update colors",
              })
            }
            break

          case "getThemes":
            this.panel.webview.postMessage({
              type: "themesData",
              themes: ColorPalette.getAllThemes(),
              currentTheme: this.themeManager.getCurrentTheme(),
            })
            break
        }
      },
      null,
      this.disposables,
    )
  }

  public reveal(): void {
    this.panel.reveal(vscode.ViewColumn.One)
  }

  public dispose(): void {
    this.panel.dispose()
    while (this.disposables.length) {
      const disposable = this.disposables.pop()
      if (disposable) {
        disposable.dispose()
      }
    }
  }

  private update(): void {
    const webview = this.panel.webview
    this.panel.webview.html = this.getHtmlForWebview(webview)
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const path = require("path")
    const scriptUri = webview.asWebviewUri(vscode.Uri.file(path.join(this.extensionUri.fsPath, "media", "customizer.js")))
    const styleUri = webview.asWebviewUri(vscode.Uri.file(path.join(this.extensionUri.fsPath, "media", "customizer.css")))

    const nonce = this.getNonce()

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
    <link href="${styleUri}" rel="stylesheet">
    <title>Neon Theme Customizer</title>
</head>
<body>
    <div class="container">
        <header>
            <h1>🌈 Neon Theme Customizer</h1>
            <p>Customize your neon-futuristic VS Code experience</p>
        </header>

        <section class="theme-selector">
            <h2>Select Base Theme</h2>
            <div id="themeGrid" class="theme-grid">
                <!-- Themes will be populated by JavaScript -->
            </div>
        </section>

        <section class="color-customizer">
            <h2>Customize Colors</h2>
            <div class="color-categories">
                <div class="category">
                    <h3>Syntax Highlighting</h3>
                    <div id="syntaxColors" class="color-inputs">
                        <!-- Color inputs will be populated by JavaScript -->
                    </div>
                </div>
                
                <div class="category">
                    <h3>UI Colors</h3>
                    <div id="uiColors" class="color-inputs">
                        <!-- Color inputs will be populated by JavaScript -->
                    </div>
                </div>
                
                <div class="category">
                    <h3>Accent Colors</h3>
                    <div id="accentColors" class="color-inputs">
                        <!-- Color inputs will be populated by JavaScript -->
                    </div>
                </div>
            </div>
        </section>

        <section class="preview">
            <h2>Live Preview</h2>
            <div class="code-preview">
                <pre><code id="previewCode">
// Neon Futuristic Theme Preview
class NeonExample {
    constructor(name: string) {
        this.name = name;
    }
    
    public greet(): void {
        console.log(\`Hello, \${this.name}!\`);
    }
}

const example = new NeonExample("World");
example.greet();
                </code></pre>
            </div>
        </section>

        <footer>
            <button id="applyBtn" class="apply-btn">Apply Theme</button>
            <button id="resetBtn" class="reset-btn">Reset to Default</button>
        </footer>
    </div>

    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`
  }

  private getNonce(): string {
    let text = ""
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  public onDidDispose(callback: () => void): void {
    this.panel.onDidDispose(callback)
  }
}
