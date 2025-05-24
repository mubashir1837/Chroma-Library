import * as vscode from "vscode"

export class Logger {
  private static outputChannel: vscode.OutputChannel

  static {
    this.outputChannel = vscode.window.createOutputChannel("Neon Themes")
  }

  public static info(message: string): void {
    const timestamp = new Date().toISOString()
    this.outputChannel.appendLine(`[${timestamp}] INFO: ${message}`)
  }

  public static error(message: string, error?: any): void {
    const timestamp = new Date().toISOString()
    this.outputChannel.appendLine(`[${timestamp}] ERROR: ${message}`)
    if (error) {
      this.outputChannel.appendLine(`[${timestamp}] ERROR DETAILS: ${JSON.stringify(error, null, 2)}`)
    }
  }

  public static warn(message: string): void {
    const timestamp = new Date().toISOString()
    this.outputChannel.appendLine(`[${timestamp}] WARN: ${message}`)
  }

  public static debug(message: string): void {
    const timestamp = new Date().toISOString()
    this.outputChannel.appendLine(`[${timestamp}] DEBUG: ${message}`)
  }

  public static show(): void {
    this.outputChannel.show()
  }

  public static dispose(): void {
    this.outputChannel.dispose()
  }
}
