"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageDetachedEvent = exports.ImageAttachedEvent = exports.MediaDeletedEvent = exports.MediaUploadedEvent = exports.MediaEvent = void 0;
var MediaEvent;
(function (MediaEvent) {
    MediaEvent["UPLOADED"] = "media.uploaded";
    MediaEvent["DELETED"] = "media.deleted";
    MediaEvent["IMAGE_ATTACHED"] = "image.attached";
    MediaEvent["IMAGE_DETACHED"] = "image.detached";
})(MediaEvent || (exports.MediaEvent = MediaEvent = {}));
class MediaUploadedEvent {
    id;
    url;
    type;
    constructor(id, url, type) {
        this.id = id;
        this.url = url;
        this.type = type;
    }
}
exports.MediaUploadedEvent = MediaUploadedEvent;
class MediaDeletedEvent {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.MediaDeletedEvent = MediaDeletedEvent;
class ImageAttachedEvent {
    mediaId;
    ownerId;
    ownerType;
    constructor(mediaId, ownerId, ownerType) {
        this.mediaId = mediaId;
        this.ownerId = ownerId;
        this.ownerType = ownerType;
    }
}
exports.ImageAttachedEvent = ImageAttachedEvent;
class ImageDetachedEvent {
    mediaId;
    constructor(mediaId) {
        this.mediaId = mediaId;
    }
}
exports.ImageDetachedEvent = ImageDetachedEvent;
//# sourceMappingURL=media.events.js.map