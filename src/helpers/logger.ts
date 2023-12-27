import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  // format: winston.format.json(),
  defaultMeta: {
    service: "cloudGroups",
    version: "dev",
  },
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize(),
    // winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
});

function info(message: any, ...ids: string[]) {
  logger.info({
    message: message,
    ids: ids,
  });
}

function debug(message: any, ...ids: string[]) {
  logger.debug({
    message: message,
    ids: ids,
  });
}

function error(error: Error | string, source: string, ...ids: string[]) {
  logger.error({
    message: error,
    source: source,
    ids: ids,
  });
}

function warn(message: any, ...ids: string[]) {
  logger.warn({
    message: message,
    ids: ids,
  });
}

export const Logger = {
  info,
  debug,
  warn,
  error,
};
