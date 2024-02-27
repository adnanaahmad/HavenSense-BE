const aws = require('aws-sdk');
const crypto = require('crypto');
const { promisify } = require('util');
const randomBytes = promisify(crypto.randomBytes);

class S3Bucket {

    constructor() {
        this.s3 = new aws.S3({
            region: process.env.S3_REGION,        
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            signatureVersion: 'v4'
        });
    }

    async generateUploadURL() {
        const rawBytes = await randomBytes(16);
        const imageName = rawBytes.toString('hex');
      
        const params = ({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: imageName,
          Expires: 60
        })
        
        const uploadURL = await this.s3.getSignedUrlPromise('putObject', params);
        return uploadURL;
    }

}

module.exports = S3Bucket;