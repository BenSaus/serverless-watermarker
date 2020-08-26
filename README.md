Serverless Image Watermarker
=====
This small API is a serverless system to upload images to S3 and watermark them using Sharp JS.

#### Process
1. First the Vue JS client calls the API and obtains a presigned url to upload the image
2. The client can then uploads the image, which is placed in a staging S3 bucket
3. The client can then call the API to watermark the image and publish it for public viewing
4. Lastly, lambda functions watermark the image if requested and move the image to a public S3 bucket where it can be served up directly or used by Amazon's Serverless Image Handler

#### Notes
The current version of Serverless framework (1.7) cannot be used with precompiled binaries, such as those needed by the Sharp JS library. See the issue [here](https://github.com/lovell/sharp/issues/2197) for details.

Because of this, the watermarking lambda is seperated from the main imageAPI and has it's own compilation process.

#### Deployment

1. Start with the ImageAPI. Set the environment variables found in serverless.yml
```
    custom:
        staging_bucket: [[The S3 bucket name where images will be watermarked]]
        public_bucket: [[The S3 bucket where images will be publicly viewable]]

        ...

    environment:
        ...
        FILE_EXTENSION: jpg
        FILE_MIME_TYPE: image/jpg
        REGION: [[ex. us-west-2]]
        WATERMARK_BUCKET: [[S3 bucket containing the watermark image]]
        WATERMARK_KEY: [[ex. watermark/watermark.png]]
        WATERMARK_DARK_KEY: [[ex. watermark/watermark_black.png]]
        WATERMARK_GRAVITY: [[north,south,east, or west]]
```

2. Deploy ImageAPI using the Serverless framework
```
serverless deploy
```
3. Then inside ImageAPIWatermark, compile the SharpJS binaries by executing package.bash
```
./package.bash
```
4. The Serverless deployment earlier included a stub lambda function called Watermark. Manually upload and overwrite this function with the `output.zip` that package.bash produced.


