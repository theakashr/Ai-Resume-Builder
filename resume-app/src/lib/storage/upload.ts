import { ApiError } from '@/lib/errors/api-error';

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit

export function validateUploadFile(file: { name: string; size: number; type: string }): { ext: string } {
  if (!file || !file.name) {
    throw ApiError.badRequest('No file uploaded');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw ApiError.badRequest('File size exceeds the 10MB limit');
  }

  const nameLower = file.name.toLowerCase();
  const ext = nameLower.substring(nameLower.lastIndexOf('.'));

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw ApiError.badRequest('Invalid file format. Only PDF and DOCX files are allowed.');
  }

  return { ext };
}
