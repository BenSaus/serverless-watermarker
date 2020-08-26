## Serverless Image Watermarker

Notes
=====
Currently Serverless cannot be used with precompiled binaries, such as those needed by the Sharp JS library.

1. First compile the library using an image that is very close the AWS Lambda environment, which can be found in docker hub at lambci/lambda.
2. Run package.bash to compile libs and create the zip file
3. Upload to AWS

Program outline
===============

1. This lambda is first triggered by an S3 putobject event
2. It then takes the uploaded image and loads it
3. Watermarks the image
4. Uploads to environment variable specified bucket