import { CONFIG } from "./config.js"; 

export class Logger {
    constructor() {
        // Inițializează array-ul de log-uri
        // Verifică configurația
        if (Logger.instance) {
            return Logger.instance;
        }
        this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
        this.logs = [];
        this.config = {
            enabled: CONFIG.LOGGING.ENABLED,
            level: this.levels[CONFIG.LOGGING.LEVEL],
            maxLogs: CONFIG.LOGGING.MAX_LOGS,
        };
        Logger.instance = this;
    }

    debug(message, data = null) {
        // Loghează doar dacă nivelul permite
        this._log(this.levels.debug, message, data);
    }

    info(message, data = null) {
        // Log pentru informații generale
        this._log(this.levels.info, message, data);
    }

    warn(message, data = null) {
        // Log pentru warning-uri
        this._log(this.levels.warn, message, data);
    }

    error(message, error = null) {
        // Log pentru erori cu stack trace
        this._log(this.levels.error, message, error?.stack);
    }

    // Metodă privată pentru formatarea log-urilor
    _log(level, message, data) {
        // Formatează: [TIMESTAMP] [LEVEL] message
        // Adaugă în array
        // Limitează numărul de log-uri
        if (!this.config.enabled || this.config.level > level) return;
        const timestamp = new Date().toLocaleTimeString();
        if (this.logs.length >= this.config.maxLogs) {
            this.logs.shift();
        }
        this.logs.push(
            `[${timestamp}] [${Object.keys(this.levels)[level]}] ${message} ${
                data ?? ""
            }`.trim()
        );
    }

    getLogs() {
        // Returnează toate log-urile
        return this.logs;
    }

    clearLogs() {
        // Șterge toate log-urile
        this.logs = [];
    }

    show() {
        // Afișează toate log-urile stocate în consolă
        if (!this.config.enabled) {
            console.log("Logging is disabled.");
            return;
        }
        console.log(this.getLogs().join("\n"));
    }
}

// Exportă o instanță unică (Singleton pattern)
export const logger = new Logger();

// Expune logger-ul global pentru debugging
window.logs = {
    show: () => logger.show(),
    clear: () => logger.clearLogs(),
    get: () => logger.getLogs(),
};
