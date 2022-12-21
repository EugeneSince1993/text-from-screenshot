import fs from 'fs';
import multer from 'multer';

export const uploadFile = () => {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      const path = './images';
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      callback(null, path);
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  });

  const upload = multer({ storage });
  return upload;
};
