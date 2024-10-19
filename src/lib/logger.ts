import { createLogger, transports, format } from "winston";

/**
 * @description logger exposes methods that allow intutive and clear logging in the server side 
 */
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
    // You can also add other files transport here
  ],
});

export default logger;
