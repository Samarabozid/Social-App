import * as multer from "multer";

export const MulterMiddleware = () => {
    return multer({storage: multer.diskStorage({})});
}