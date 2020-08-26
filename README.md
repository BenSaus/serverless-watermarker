Serverless Image Watermarker
=====
Using AWS Lambda, API Gateway, and the Serverless framework, this system watermarks images uploaded to AWS S3. 

#### Process
1. First the client obtains a signed url to upload the image
2. Then the client uploads the image
3. The client can then call the API to watermark the image or just publish it
4. Lambda functions watermark the image if requested and move the image to a public S3 bucket


### Notes
Currently Serverless cannot be used with precompiled binaries, such as those needed by the Sharp JS library.

1. First compile the library using an image that is very close the AWS Lambda environment, which can be found in docker hub at lambci/lambda.
2. Run package.bash to compile libs and create the zip file
3. Upload to AWS

### Program outline
1. This lambda is first triggered by an S3 putobject event
2. It then takes the uploaded image and loads it
3. Watermarks the image
4. Uploads to environment variable specified bucket