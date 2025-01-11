require('dotenv').config();
const fs = require("fs");
const AWS = require('aws-sdk');

async function uploadProfileImage(userId, image) {
    const s3 = new AWS.S3();

    if (image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png') {
        throw new Error('Invalid file type');
    }

    if (image.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('File size exceeds the limit');
    }

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profile-images/${userId}`,
        Body: fs.createReadStream(image.path),
        ContentType: image.mimetype
    };

    try {
        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload image');
    }
}


async function deleteProfileImage(userId) {
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profile-images/${userId}`
    };

    try {
        await s3.deleteObject(params).promise();
    } catch (error) {
        console.error('Error deleting file:', error);
        throw new Error('Failed to delete image');
    }
}

module.exports = {
    uploadProfileImage,
    deleteProfileImage
}