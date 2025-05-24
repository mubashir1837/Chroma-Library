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
exports.ErrorHandler = void 0;
const vscode = __importStar(require("vscode"));
const logger_1 = require("./logger");
class ErrorHandler {
    static handleError(message, error) {
        logger_1.Logger.error(message, error);
        // Show user-friendly error message
        const errorMessage = this.formatErrorMessage(message, error);
        vscode.window.showErrorMessage(errorMessage);
    }
    static handleWarning(message, details) {
        logger_1.Logger.warn(message);
        if (details) {
            logger_1.Logger.debug(`Warning details: ${JSON.stringify(details)}`);
        }
        vscode.window.showWarningMessage(message);
    }
    static handleInfo(message) {
        logger_1.Logger.info(message);
        vscode.window.showInformationMessage(message);
    }
    static formatErrorMessage(message, error) {
        if (error instanceof Error) {
            return `${message}: ${error.message}`;
        }
        if (typeof error === "string") {
            return `${message}: ${error}`;
        }
        return message;
    }
    static async handleAsyncError(operation, errorMessage) {
        try {
            return await operation();
        }
        catch (error) {
            this.handleError(errorMessage, error);
            return undefined;
        }
    }
    static wrapWithErrorHandling(fn, errorMessage) {
        return (...args) => {
            try {
                return fn(...args);
            }
            catch (error) {
                this.handleError(errorMessage, error);
                return undefined;
            }
        };
    }
    static createErrorBoundary(operation, fallback, errorMessage) {
        try {
            return operation();
        }
        catch (error) {
            this.handleError(errorMessage, error);
            return fallback;
        }
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=errorHandler.js.map