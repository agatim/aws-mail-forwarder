
/**
 * LoggerData interface
 * This interface defines the data structure of the log message
 */
export interface LoggerData {
    timestamp: Date;
    message: string;
    level: string;
    name?: string;
    data?: { [key: string]: any };
}