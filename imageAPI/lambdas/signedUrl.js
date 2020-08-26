'use strict';
const shortId = require('shortid')

const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.REGION || "us-west-2" })
const s3 = new AWS.S3({signatureVersion: 'v4'})


exports.handler = async event => {
    const id = shortId.generate()
    const filename = `${id}.${process.env.FILE_EXTENSION}`

    const params = {
        Bucket: process.env.STAGING_BUCKET,
        Fields: {
            key: filename,
            "Content-Type": process.env.FILE_MIME_TYPE,
        },
        Expires: 300,
    }

    const data = await(new Promise((resolve, reject) => {
        s3.createPresignedPost(params, (err, data) => {
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    }))

    const result = {
        statusCode: 200,
        isBase64Encoded: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ data })
    }

    console.log(result)
    return result
};
