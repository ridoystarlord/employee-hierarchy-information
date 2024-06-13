import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json, colorize } = format;

const combinedTransport = new DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  dirname: './logs/combined',
});
const errorTransport = new DailyRotateFile({
  level: 'error',
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  dirname: './logs/error',
});

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message }) => {
    return `${level}: ${message}`;
  }),
);

// Create a Winston logger
const Logger = createLogger({
  level: 'info',
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    combinedTransport,
    errorTransport,
  ],
});

export default Logger;
