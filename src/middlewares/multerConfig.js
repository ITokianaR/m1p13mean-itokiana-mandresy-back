import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dir = "storages";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, "storages");
  },
  filename: (req, file, callback) => {
    const extension = file.mimetype.split("/")[1];
    callback(
      null,
      file.originalname.split(".")[0] + Date.now() + "." + extension
    );
  },
});

const upload = multer({ storage });

export default upload;