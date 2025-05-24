import * as vscode from "vscode"
import { Logger } from "./logger"

export class ErrorHandler {
  public static handleError(message: string, error: any): void {
    Logger.error(message, error)

    // Show user-friendly error message
    const errorMessage = this.formatErrorMessage(message, error)
    vscode.window.showErrorMessage(errorMessage)
  }

  public static handleWarning(message: string, details?: any): void {
    Logger.warn(message)

    if (details) {
      Logger.debug(`Warning details: ${JSON.stringify(details)}`)
    }

    vscode.window.showWarningMessage(message)
  }

  public static handleInfo(message: string): void {
    Logger.info(message)
    vscode.window.showInformationMessage(message)
  }

  private static formatErrorMessage(message: string, error: any): string {
    if (error instanceof Error) {
      return `${message}: ${error.message}`
    }

    if (typeof error === "string") {
      return `${message}: ${error}`
    }

    return message
  }

  public static async handleAsyncError<T>(operation: () => Promise<T>, errorMessage: string): Promise<T | undefined> {
    try {
      return await operation()
    } catch (error) {
      this.handleError(errorMessage, error)
      return undefined
    }
  }

  public static wrapWithErrorHandling<T extends any[], R>(
    fn: (...args: T) => R,
    errorMessage: string,
  ): (...args: T) => R | undefined {
    return (...args: T) => {
      try {
        return fn(...args)
      } catch (error) {
        this.handleError(errorMessage, error)
        return undefined
      }
    }
  }

  public static createErrorBoundary<T>(operation: () => T, fallback: T, errorMessage: string): T {
    try {
      return operation()
    } catch (error) {
      this.handleError(errorMessage, error)
      return fallback
    }
  }
}
