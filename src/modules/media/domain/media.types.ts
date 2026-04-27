export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  OTHER = 'other',
}

export enum FileFormat {
  WEBP = 'webp',
  JPG = 'jpg',
  JPEG = 'jpeg',
  PNG = 'png',
  GIF = 'gif',
  MP4 = 'mp4',
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  XLS = 'xls',
  XLSX = 'xlsx',
  CSV = 'csv',
}

export enum MediaStatus {
  TEMP = 'temp',
  ACTIVE = 'active',
}

/**
 * Allowed MIME types for file uploads.
 * Maps file formats to their corresponding MIME types for proper validation.
 */
export const ALLOWED_MIME_TYPES: Record<string, string> = {
  // Image formats
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',

  // Video formats
  mp4: 'video/mp4',

  // Document formats
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
};

/**
 * Regex pattern for validating file MIME types.
 * Generated from ALLOWED_MIME_TYPES for use in FileTypeValidator.
 */
export const ALLOWED_MIME_TYPES_REGEX = new RegExp(
  `^(${Object.values(ALLOWED_MIME_TYPES).join('|')})$`,
);

export interface FileMetadata {
  id: string;
  url: string;
  storageKey: string;
  status: MediaStatus;
  ownerId?: string;
  ownerType?: string;
  type: MediaType;
  format: string;
  size: number;
  width?: number;
  height?: number;
  originalName: string;
  mimeType: string;
  createdAt: Date;
}
