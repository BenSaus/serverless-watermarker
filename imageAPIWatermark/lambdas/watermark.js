const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.REGION || "us-west-2" })
const s3 = new AWS.S3({ signatureVersion: "v4" })

const sharp = require("sharp")

exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body)
    const imageName = requestBody.imageName

    const watermarkGravity = requestBody.watermarkGravity
    const watermarkDark = requestBody.watermarkDark ? requestBody.watermarkDark : false
    const watermarkWidth = requestBody.watermarkWidth ? requestBody.watermarkWidth : null
    const watermarkBottom = requestBody.watermarkBottom ? requestBody.watermarkBottom : 0
    const watermarkTop = requestBody.watermarkTop ? requestBody.watermarkTop : 0

    console.log('watermark')
    console.log(imageName, watermarkGravity, watermarkWidth, watermarkBottom, watermarkTop, watermarkDark)


    let watermark
    if(watermarkDark) 
        watermark = await getFile(process.env.WATERMARK_BUCKET, process.env.WATERMARK_DARK_KEY)
    else
        watermark = await getFile(process.env.WATERMARK_BUCKET, process.env.WATERMARK_KEY)

    let processedWatermark = await resizeImage(watermark, watermarkWidth)
    console.log('resized image')
    if (watermarkBottom || watermarkTop) {
        console.log('watermark bottom')
        processedWatermark = await extendImage(processedWatermark, watermarkTop, watermarkBottom)
    }

    console.log('creating watermark pipe')
    const watermarkingPipe = createWatermarkPipe(processedWatermark, watermarkGravity)
    
    // Get the read stream for the image to be processed
    const imageStream = getReadStream(imageName)

    // Direct the streaming data from the s3 bucket to sharp
    imageStream.pipe(watermarkingPipe)

    console.log('upload')
    // TODO: Check response for errors
    const uploadResp = await uploadToBucket(imageName, watermarkingPipe)

    return respond(200, {message: 'success'})
}



async function getFile (bucket, key) {
    const params = {
        Bucket: bucket,
        Key: key
    }

    const response = await ( new Promise( (resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if(err) reject(err)
            else resolve(data)
        })
    }))

    return response.Body
}

async function resizeImage (buffer, width) {    
    return sharp(buffer)
        .resize({ 
            width: width,
            height: null        // forces auto scaling
        })
        .toBuffer()
}

async function extendImage(buffer, top, bottom) {
    return sharp(buffer)
        .extend({ 
            top: top,
            bottom: bottom,
            left: 0,
            right: 0,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toBuffer()
}

function getReadStream (filename) {
    // Get image from origin s3 bucket
    const getParams = {
        Bucket: process.env.STAGING_BUCKET,
        Key: filename,
    }
    
    // Create a readable stream from the s3 object
    return s3.getObject(getParams).createReadStream()
}

// Doesn't work with read streams
async function getImageMetadata (data) {
    const image = sharp(data)
    console.log('getImageMetaData')
    console.log(image)
    return image.metadata()
}

function createWatermarkPipe (watermark, watermarkGravity) {

    //https://sharp.pixelplumbing.com/api-resize#resize
    return sharp()
        // Add a watermark to the image
        .composite([{
            input: watermark,
            gravity: watermarkGravity ? watermarkGravity : process.env.WATERMARK_GRAVITY
        }])
        .jpeg({
            quality: 100,
        })
}

async function uploadToBucket (filename, body) {
    // Upload image to destination bucket
    const params = {
        Bucket: process.env.STAGING_BUCKET,
        Key: filename,
        Body: body,
        ContentType: 'image/jpeg'
    }

    const uploadResp = await ( new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if(err) {
                    response = 'An error occured attempting to upload the watermarked image'
                    reject(err) 
                }
                else { resolve(data) }
            })
        }
    ))

    return uploadResp
}

function respond (statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(body),
    };
}
