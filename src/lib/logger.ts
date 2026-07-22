import { createHash } from 'crypto';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function sanitizeLogData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization', 'email', 'phone', 'clientEmail', 'clientPhone'];
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'string' && value.length > 1000) {
      sanitized[key] = value.substring(0, 1000) + '...';
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

function formatLogEntry(entry: LogEntry): string {
  const sanitizedContext = entry.context ? sanitizeLogData(entry.context) : undefined;
  return JSON.stringify({ ...entry, context: sanitizedContext });
}

function writeLog(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
  
  const formatted = formatLogEntry(entry);
  
  switch (level) {
    case 'debug': console.debug(formatted); break;
    case 'info': console.info(formatted); break;
    case 'warn': console.warn(formatted); break;
    case 'error': console.error(formatted); break;
  }
}

export function logDebug(message: string, context?: Record<string, unknown>): void {
  if (process.env.LOG_LEVEL === 'debug') writeLog('debug', message, context);
}

export function logInfo(message: string, context?: Record<string, unknown>): void {
  const level = process.env.LOG_LEVEL || 'info';
  if (['debug', 'info'].includes(level)) writeLog('info', message, context);
}

export function logWarn(message: string, context?: Record<string, unknown>): void {
  const level = process.env.LOG_LEVEL || 'info';
  if (['debug', 'info', 'warn'].includes(level)) writeLog('warn', message, context);
}

export function logError(message: string, context?: Record<string, unknown>): void {
  writeLog('error', message, context);
}

export function logSecurityEvent(event: string, details: Record<string, unknown>): void {
  const hashedIp = details.ip ? createHash('sha256').update(String(details.ip)).digest('hex').substring(0, 16) : undefined;
  logError(`SECURITY: ${event}`, { ...details, ip: hashedIp });
}

export async function logAuditAction(
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  logInfo('AUDIT', { userId, action, resource, resourceId, details });
}
