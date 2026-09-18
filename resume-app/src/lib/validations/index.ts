import { z } from 'zod';
import { ApiError } from '@/lib/errors/api-error';

export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' });

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function parseRequestBody<T>(request: Request, schema: z.ZodSchema<T>): Promise<T> {
  try {
    const json = await request.json();
    return schema.parse(json);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw ApiError.badRequest('Invalid JSON body');
    }
    throw error; // Will be formatted by handleApiError as ZodError
  }
}

export function parseQueryParams<T>(url: string, schema: z.ZodSchema<T>): T {
  const { searchParams } = new URL(url);
  const paramsObject: Record<string, unknown> = {};
  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  return schema.parse(paramsObject);
}
