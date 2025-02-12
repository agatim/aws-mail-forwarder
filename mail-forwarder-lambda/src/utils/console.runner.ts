import { LoggerData } from "./logger-data";
import { LoggerRunner } from "./logger-runner";
import * as util from "util";


/**
 * ConsoleRunner class
 * This class implements the LoggerRunner interface
 * It logs the log messages to the console
 * The log messages are formatted with the util.inspect method that returns a string representation of the messageData object
 */
export class ConsoleRunner implements LoggerRunner {
    log(messageData: LoggerData): void {
        console.log(util.inspect(messageData, false, null, false));
    }
}