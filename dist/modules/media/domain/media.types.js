"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaStatus = exports.FileFormat = exports.MediaType = void 0;
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
//# sourceMappingURL=media.types.js.map