import { NextResponse } from 'next/server';
import { ApiSuccessResponse } from '@/types/api.types';

export function successResponse<T>(data: T, status = 200, meta?: ApiSuccessResponse<T>['meta']): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    },
    { status }
  );
}

export function createdResponse<T>(data: T, meta?: ApiSuccessResponse<T>['meta']): NextResponse<ApiSuccessResponse<T>> {
  return successResponse(data, 201, meta);
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<ApiSuccessResponse<T[]>> {
  return successResponse(data, 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}
