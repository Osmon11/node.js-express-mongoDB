import multer from "multer";
import { v4 as uuidv4 } from "uuid";

export const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, "image/");
  },
  filename(_req, file, cb) {
    cb(null, uuidv4());
  },
});

export const upload = multer({ storage });
