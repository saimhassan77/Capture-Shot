import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localPath) => {
    try {

        if (!localPath) return null
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: 'auto'
        })

        //removed file upload on cloudinary
        fs.unlinkSync(localPath);

        // upload successful
        console.log("Upload Successful", response.url);
        return response;
         

    }
    catch (error) {

        console.log("CloudinaryError",error);
        return null
    }
}

const deleteCloudinary = async (localPath) => {

    try {
        if (!localPath) return null;
            
        await cloudinary.uploader.destroy(localPath, { resource_type: 'image' })
        .then(result => console.log("DeleteC",result));

        console.log("Delete Successfully",localPath);
    } catch (error) {
        console.log("Cloudinary delete error", error);
    }

}

export { uploadCloudinary, deleteCloudinary }