'use strict';
const shortId = require('shortid')

const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.REGION || "us-west-2" })
const s3 = new AWS.S3({signatureVersion: 'v4'})


exports.handler = async event => {
    console.log(JSON.stringify(event, null, 2))
    
    const requestBody = JSON.parse(event.body)
    console.log('requestBody', requestBody)

    const filename = requestBody.imageName
    console.log('filename', filename)

    // Setting up S3 upload parameters
    const params = {
        Key: filename,         // File name you want to save as in S3
        Bucket: process.env.PUBLIC_BUCKET, 
        CopySource:  `${process.env.STAGING_BUCKET}/${filename}`,
        Key: filename
    }
    console.log('params',params)

    const result = await(new Promise((resolve, reject) => {
        s3.copyObject(params, function(err, data) {
            if (err) reject(err)
            else resolve(data)
        })
    }))

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
                message: result,
                input: event,
            },
            null,
            2
        ),
    };
};
