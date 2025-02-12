import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

async function uploadProfileImage(userId, image) {
    if (image.mimetype !== "image/jpeg" && image.mimetype !== "image/png") {
        throw new Error("Invalid file type");
    }

    if (image.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds the limit");
    }

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profile-images/${userId}`,
        Body: fs.createReadStream(image.path),
        ContentType: image.mimetype,
    };

    try {
        const command = new PutObjectCommand(params);
        const result = await s3.send(command);
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profile-images/${userId}`;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload image");
    }
}

async function deleteProfileImage(userId) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profile-images/${userId}`,
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw new Error("Failed to delete image");
    }
}

export { uploadProfileImage, deleteProfileImage };
