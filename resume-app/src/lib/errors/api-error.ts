import { NextResponse } from 'next/server';
import { ApiErrorCode, ApiErrorResponse } from '@/types/api.types';
import { ZodError } from 'zod';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ApiErrorCode;
  public readonly details?: unknown;

  constructor(statusCode: number, code: ApiErrorCode, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static unauthorized(message = 'Authentication required'): ApiError {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Access denied'): ApiError {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, 'CONFLICT', message);
  }

  static unprocessable(message: string): ApiError {
    return new ApiError(422, 'UNPROCESSABLE_ENTITY', message);
  }

  static tooManyRequests(message = 'Rate limit exceeded'): ApiError {
    return new ApiError(429, 'TOO_MANY_REQUESTS', message);
  }

  static internal(message = 'An unexpected internal server error occurred'): ApiError {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // Handle Zod Validation Errors (using error.issues)
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload or parameters',
          details: formattedErrors,
        },
      },
      { status: 400 }
    );
  }

  // Handle Custom ApiError
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      },
      { status: error.statusCode }
    );
  }

  // Fallback for unhandled exceptions (prevent database logs / stack traces from leaking)
  console.error('[UNHANDLED_API_ERROR]', error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    },
    { status: 500 }
  );
}
