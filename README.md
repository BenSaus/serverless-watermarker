Serverless Image Watermarker
=====
This small API is a serverless system to upload images to S3 and watermark them using Sharp JS.

#### Process
1. First the Vue JS client obtains a signed url to upload the image from the API
2. The client can then upload the image, which is placed in a staging S3 bucket
3. The client can then call the API to watermark the image and publish it for public viewing
4. Lastly, lambda functions watermark the image if requested and move the image to a public S3 bucket where it can be served up directly or used by Amazon's Serverless Image Handler

### Notes
The current version of Serverless framework (1.7) cannot be used with precompiled binaries, such as those needed by the Sharp JS library. See the issue [here](https://github.com/lovell/sharp/issues/2197) for details.

Because of this, the watermarking lambda is seperated from the main imageAPI and has it's own compilation process.



