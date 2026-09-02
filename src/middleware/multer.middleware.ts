import multer from "multer";

export function profileImg(req: any, res: any, next: any) {
  try {
    const img = multer({ dest: "./uploads/" }).single("img");
    console.log(img);
    next()
  } catch (e) {
    res.status(400).send("error en la subida del archivo");
  }
}
