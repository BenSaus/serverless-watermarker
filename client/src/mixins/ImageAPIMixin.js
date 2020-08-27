import axios from "axios"
import config from "../../config"

const ImageAPIMixin = {
    methods: {
        async publishImage(imageKey) {
            console.log("Publish Image")
            const url = config.api_gateway + "image/publish"
            const result = await axios.post(
                url,
                { imageName: imageKey },
                { headers: { "x-api-key": config.api_key } }
            )

            // TODO: Test response for errors here...

            const imageUrl = config.publish_bucket_url + imageKey
            return imageUrl
        },

        async watermarkImage(imageKey, options) {
            console.log("Watermark Image")
            const url = config.api_gateway + "image/watermark"
            const result = await axios.post(
                url,
                { 
                    imageName: imageKey, 
                    watermarkGravity: options.gravity,
                    watermarkDark: options.dark,
                    watermarkWidth: options.width,
                    watermarkBottom: options.bottom,
                    watermarkTop: options.top,
                },
                { headers: { "x-api-key": config.api_key } }
            )

            // TODO: Test response for errors here...

            return result
        },
    },
}

export default ImageAPIMixin
