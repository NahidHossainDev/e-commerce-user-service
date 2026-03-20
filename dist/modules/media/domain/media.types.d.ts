export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
    DOCUMENT = "document",
    OTHER = "other"
}
export declare enum FileFormat {
    WEBP = "webp",
    JPG = "jpg",
    JPEG = "jpeg",
    PNG = "png",
    GIF = "gif",
    MP4 = "mp4",
    PDF = "pdf",
    DOC = "doc",
    DOCX = "docx",
    XLS = "xls",
    XLSX = "xlsx",
    CSV = "csv"
}
export declare enum MediaStatus {
    TEMP = "temp",
    ACTIVE = "active"
}
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
