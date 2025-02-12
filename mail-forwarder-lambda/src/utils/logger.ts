import {LoggerData} from "./logger-data";
import {LogLevel} from "./log-level";
import { LoggerRunner } from "./logger-runner";
import { ConsoleRunner } from "./console.runner";

/**
 * Function that instantiates the logger runners. The logger runners are defined in the environment variable LOG_RUNNER.
 * The logger runners must be passed with the ; separator.
 * The default logger runner is the console runner.
 * Even if the environment variable LOG_RUNNER is set, the console runner is instantiated and appended to the runners array.
 * @returns an array of logger runners
 */
const instantiateRunners = async (): Promise<LoggerRunner[]> => {
    const runners: LoggerRunner[] = [];
    if (process.env.LOG_RUNNER) {
        for (const elem of process.env.LOG_RUNNER.split(';')) {
            const module = await import(elem);
            runners.push(new module());
        }
    }
    runners.push(new ConsoleRunner());
    return runners;
};

export const runners: LoggerRunner[] = await instantiateRunners();

/**
 * This class provides a simple logging mechanism. It is possible to log messages with different log levels.
 * The log level can be set via the environment variable LOG_LEVEL. The default log level is INFO.
 * The log level can be set to DEBUG, INFO, WARNING or ERROR.
 * The log level can be set via the setLevel method.
 * You can log messages with the following methods:
 * - debug
 * - info
 * - warning
 * - error
 * - exception
 * The exception method logs an error message and the stack trace of the error.
 * The log messages are sent to all registered log runners.
 * The log runners are defined in the environment variable LOG_RUNNER and must be passed with the ; separator. The default log runner is the console runner.
 */
export class Logger {
    public static readonly DEBUG: LogLevel = {value: 1, name: 'DEBUG'};
    public static readonly INFO: LogLevel = {value: 2, name: 'INFO'};
    public static readonly WARNING: LogLevel = {value: 3, name: 'WARNING'};
    public static readonly ERROR: LogLevel = {value: 4, name: 'ERROR'};
    private static readonly runner: LoggerRunner[] = runners;
    private static level: LogLevel = process.env.LOG_LEVEL ? Logger.fromString(process.env.LOG_LEVEL) : Logger.INFO;

    /**
     * 
     * @param message the message to log
     * @param name the name of the logger (optional)
     * @param data the data to log (optional)
     */
    public static debug(message: string, name?: string, data?: { [key: string]: any }): void {
        if (Logger.level.value <= Logger.DEBUG.value) {
            Logger.log(message, Logger.DEBUG, name, data);
        }
    }

    /**
     * 
     * @param message the message to log
     * @param name the name of the logger (optional)
     * @param data the data to log (optional)
     */
    public static error(message: string, name?: string, data?: { [key: string]: any }): void {
        if (Logger.level.value <= Logger.ERROR.value) {
            Logger.log(message, Logger.ERROR, name, data);
        }
    }

    /**
     * 
     * @param message the message to log
     * @param name the name of the logger (optional)
     * @param data the data to log (optional)
     */
    public static info(message: string, name?: string, data?: { [key: string]: any }): void {
        if (Logger.level.value <= Logger.INFO.value) {
            Logger.log(message, Logger.INFO, name, data);
        }
    }

    /**
     * 
     * @param message the message to log
     * @param name the name of the logger (optional)
     * @param data the data to log (optional)
     */
    public static warning(message: string, name?: string, data?: { [key: string]: any }): void {
        if (Logger.level.value <= Logger.WARNING.value) {
            Logger.log(message, Logger.WARNING, name, data);
        }
    }

    public static setLevel(level: LogLevel): void {
        Logger.level = level;
    }

    /**
     * Log an exception with the error message and the stack trace of the error
     * 
     * @param e the error to log 
     * @param name the name of the logger (optional)
     * @param data the data to log (optional)
     */
    public static exception(e: Error, name?: string, data?: { [key: string]: any }): void {
        if (data) {
            data.trace = Error().stack?.toString() ?? '';
        } else {
            data = {trace: Error().stack?.toString() ?? ''};
        }
        const message = JSON.stringify((e as any)?.response?.data ?? e.message);
        Logger.log(message, Logger.ERROR, name, data);
    }

    protected static log(message: string, level: LogLevel, name?: string, data?: { [key: string]: any }): void {
        const messageData: LoggerData = {
            timestamp: new Date(),
            message,
            level: level.name,
            name,
            data
        }
        this.runner.forEach(e => e.log(messageData));
    }

    private static fromString(level: string): LogLevel {
        switch (level) {
            case 'DEBUG':
                return Logger.DEBUG;
            case 'INFO':
                return Logger.INFO;
            case 'WARNING':
                return Logger.WARNING;
            case 'ERROR':
                return Logger.ERROR;
            default:
                return Logger.INFO;
        }
    }

}
