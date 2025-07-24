import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/appError";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
})

// Delete unnecessary files that are uploaded without actual operation and didn't sent to database
export const deleteImageFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i
        const match = url.match(regex)

        if (match && match[1]) {
            const public_id = match[1]
            await cloudinary.uploader.destroy(public_id)
            console.log(`File ${public_id} is deleted from cloudinary`)
        }
    }catch(error: any){
        console.log('Error while deleting files from cloudinary.', error)
        throw new AppError(401, 'Cloudinary Image deletion failed', error.message)
    }
}

export const cloudinaryUpload = cloudinary