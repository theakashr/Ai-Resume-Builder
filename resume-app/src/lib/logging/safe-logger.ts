const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'authorization',
  'api_key',
  'apikey',
  'stripe_secret_key',
  'stripe_signature',
  'cookie',
  'access_token',
  'refresh_token',
  'credit_card',
  'cvv',
];

function sanitize(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((k) => lowerKey.includes(k))) {
      cleanObj[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      cleanObj[key] = sanitize(value);
    } else {
      cleanObj[key] = value;
    }
  }

  return cleanObj;
}

export const safeLogger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta ? sanitize(meta) : '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta ? sanitize(meta) : '');
  },
  error: (message: string, meta?: any) => {
    console.error(`[ERROR] ${message}`, meta ? sanitize(meta) : '');
  },
};
