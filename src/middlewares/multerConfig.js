import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
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