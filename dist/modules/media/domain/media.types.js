"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_MIME_TYPES_REGEX = exports.ALLOWED_MIME_TYPES = exports.MediaStatus = exports.FileFormat = exports.MediaType = void 0;
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
    MediaType["DOCUMENT"] = "document";
    MediaType["OTHER"] = "other";
})(MediaType || (exports.MediaType = MediaType = {}));
var FileFormat;
(function (FileFormat) {
    FileFormat["WEBP"] = "webp";
    FileFormat["JPG"] = "jpg";
    FileFormat["JPEG"] = "jpeg";
    FileFormat["PNG"] = "png";
    FileFormat["GIF"] = "gif";
    FileFormat["MP4"] = "mp4";
    FileFormat["PDF"] = "pdf";
    FileFormat["DOC"] = "doc";
    FileFormat["DOCX"] = "docx";
    FileFormat["XLS"] = "xls";
    FileFormat["XLSX"] = "xlsx";
    FileFormat["CSV"] = "csv";
})(FileFormat || (exports.FileFormat = FileFormat = {}));
var MediaStatus;
(function (MediaStatus) {
    MediaStatus["TEMP"] = "temp";
    MediaStatus["ACTIVE"] = "active";
})(MediaStatus || (exports.MediaStatus = MediaStatus = {}));
exports.ALLOWED_MIME_TYPES = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    mp4: 'video/mp4',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
};
exports.ALLOWED_MIME_TYPES_REGEX = new RegExp(`^(${Object.values(exports.ALLOWED_MIME_TYPES).join('|')})$`);
//# sourceMappingURL=media.types.js.map