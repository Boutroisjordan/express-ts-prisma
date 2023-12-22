import multer, { MulterError } from 'multer';
import { RequestHandler } from 'express';

class UploadManager {
  private storage = multer.memoryStorage();
  private upload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter.bind(this),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB 
    },
  });

  public getMiddleware(fieldName: string): RequestHandler {
    return this.upload.single(fieldName);
  }

  private fileFilter(req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void {
    const allowedMimes = ['image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type. Only JPEG and PNG are allowed.'));
    }
  }
}

const uploadManager = new UploadManager();

export default uploadManager;
