#!/usr/bin/bash

rm -rf node_modules/sharp
docker run --rm -v "/$(pwd -W):/var/task" lambci/lambda:build-nodejs12.x npm install sharp
mkdir .output
rm .output/output.zip
docker run --rm -v "/$(pwd -W):/var/task" lambci/lambda:build-nodejs12.x zip -r --symlinks .output/output.zip . -x '*.git*' -x '*.output*' -x 'package.bash'