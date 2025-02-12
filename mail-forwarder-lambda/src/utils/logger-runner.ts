import { LoggerData } from "./logger-data";

/**
 * Logger runner interface
 * You can implement this interface to create a custom logger runner
 */
export interface LoggerRunner {
    log(messageData: LoggerData): void;
}