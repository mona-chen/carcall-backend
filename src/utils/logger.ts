import { AnsiColor } from "../constants/ansicolor";
import util from "util";

type ILog = typeof console.log;
class Logger {
  private color: string;

  constructor(options?: { color?: string }) {
    this.color = options?.color || "";
  }

  protected getLevelEmoji(level: string): string {
    switch (level) {
      case "DEBUG":
        return "🐛";
      case "INFO":
        return "ℹ️";
      case "WARNING":
        return "⚠️";
      case "ERROR":
        return "❌";
      case "CRITICAL":
        return "🚨";
      default:
        return "❓";
    }
  }

  protected getLevelColor(level: string): string {
    switch (level) {
      case "DEBUG":
        return "\x1b[34m"; // blue
      case "INFO":
        return "\x1b[32m"; // green
      case "WARNING":
        return "\x1b[33m"; // yellow
      case "ERROR":
      case "CRITICAL":
        return "\x1b[31m"; // red
      default:
        return ""; // no color
    }
  }

  debug(message: string, ...optionalParams: any[]) {
    this.log("DEBUG", message, ...optionalParams);
  }

  info(message: any, ...optionalParams: any[]) {
    this.log("INFO", message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.log("WARNING", message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.log("ERROR", message, ...optionalParams);
  }

  critical(message: any, ...optionalParams: any[]) {
    this.log("CRITICAL", message, ...optionalParams);
  }

  public log(message?: any, ...optionalParams: any[]) {
    let level = "INFO"; // Default level if not provided
    if (typeof message === "string") {
      // If the first parameter is a string, assume it's the log level
      level = message;
      message = optionalParams.shift(); // Remove the first element from optionalParams
    }

    const levelEmoji = this.getLevelEmoji(level?.toUpperCase());
    const levelColor = this.color || this.getLevelColor(level); // Use custom color if provided, otherwise use default color
    const levelColorReset = "\x1b[0m"; // Reset color

    // Check if message is an object
    if (typeof message === "object" && message !== null) {
      // Use util.inspect to get a string representation of the object
      message = util.inspect(message, { depth: null });
    }

    console.log(
      levelColor,
      levelEmoji,
      message,
      ...optionalParams, // Spread the remaining optionalParams
      levelColorReset,
      AnsiColor.RESET
    );
  }
}

export default Logger;

export const logger = new Logger();
