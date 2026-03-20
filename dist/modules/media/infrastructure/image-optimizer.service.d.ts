import * as sharp from 'sharp';
export declare class ImageOptimizerService {
    private readonly logger;
    convertToWebP(file: Buffer): Promise<{
        data: Buffer;
        info: sharp.OutputInfo;
    }>;
    getMetadata(file: Buffer): Promise<sharp.Metadata>;
    isImage(mimeType: string): boolean;
    isVideo(mimeType: string): boolean;
    isDocument(mimeType: string): boolean;
}
