import path from 'path';
import multer, { type StorageEngine } from 'multer';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

interface IUploadConfig {
  directory: string;
  storage: StorageEngine;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

export default {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;
      callback(null, fileName);
    },
  }),
} as IUploadConfig;
