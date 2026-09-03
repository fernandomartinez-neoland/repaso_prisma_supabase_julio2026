import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        // extensión real del archivo subido: .jpg, .png, ...
        const ext = path.extname(file.originalname);
        // nombre sin extensión, limpio de espacios y caracteres raros
        const name = path
            .basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-");
        cb(null, `${name}-${Date.now()}${ext}`);
    },
});
export const profileImg = multer({ storage }).single("img");
