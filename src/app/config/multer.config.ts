import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            // return a unique file name
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/\.+/g, '-')
                .replace(/[^a-zA-Z0-9]/g, '')

            const extension = file.originalname.split('.').pop()
            const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extension

            return uniqueFileName

        }
    }
})

export const multerUpload = multer({storage})