import { ApiError } from '@/lib/errors/api-error';

export type RateLimitCategory = 'login' | 'ai' | 'ats' | 'interviews' | 'uploads' | 'billing';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const CATEGORY_CONFIGS: Record<RateLimitCategory, RateLimitConfig> = {
  login: { windowMs: 60 * 1000, maxRequests: 5 },
  ai: { windowMs: 60 * 1000, maxRequests: 10 },
  ats: { windowMs: 60 * 1000, maxRequests: 10 },
  interviews: { windowMs: 60 * 1000, maxRequests: 10 },
  uploads: { windowMs: 60 * 1000, maxRequests: 5 },
  billing: { windowMs: 60 * 1000, maxRequests: 10 },
};

const requestStore = new Map<string, number[]>();

export function checkRateLimit(userId: string, category: RateLimitCategory = 'ai'): void {
  const config = CATEGORY_CONFIGS[category] || CATEGORY_CONFIGS.ai;
  const key = `${category}:${userId}`;
  const now = Date.now();

  const timestamps = requestStore.get(key) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < config.windowMs);

  if (validTimestamps.length >= config.maxRequests) {
    throw ApiError.tooManyRequests(
      `Rate limit exceeded for ${category}. You may only make ${config.maxRequests} requests per minute.`
    );
  }

  validTimestamps.push(now);
  requestStore.set(key, validTimestamps);
}
