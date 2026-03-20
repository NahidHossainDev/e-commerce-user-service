"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMediaIdFromUrl = extractMediaIdFromUrl;
const path = require("path");
function extractMediaIdFromUrl(url) {
    if (!url)
        return null;
    try {
        const filename = url.split('/').pop();
        if (!filename)
            return null;
        return path.parse(filename).name;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=media-helper.js.map