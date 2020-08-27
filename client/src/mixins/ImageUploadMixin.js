import axios from "axios"
import config from "../../config"

const ImageUploadMixin = {
    methods: {
        async uploadImage(fileBuffer) {
            const presignedResp = await this._getPresignedUrl()
            const formData = await this._createFormData(
                fileBuffer,
                presignedResp
            )

            // TODO: Test image parameters (height, width, aspect ratio, size, ect) here!!!
            return await this._upload(formData, presignedResp.data.data.url)
        },
        async _getPresignedUrl() {
            return await axios.get(config.api_gateway + "signedUrl", {
                headers: { "x-api-key": config.api_key },
            })
        },
        async _createFormData(fileBuffer, presignedResp) {
            const formData = new FormData()
            Object.keys(presignedResp.data.data.fields).forEach((key) =>
                formData.append(key, presignedResp.data.data.fields[key])
            )

            // Note: The file MUST be appended last
            formData.append("file", fileBuffer)

            return formData
        },
        async _upload(formData, url) {
            // Ensure the response here is good. Then the key can be stored in the db
            this.isSaving = true
            
            let uploadResp
            
            try {
                // TODO: Change to axios
                uploadResp = await fetch(url, {
                    method: "POST",
                    headers: { "x-api-key": config.api_key },
                    body: formData,
                })
            } catch (err) {
                console.error("There was an error uploading the image")
                console.log(err)
            }

            this.isSaving = false

            if (uploadResp.ok) {
                return formData.get("key")
            } else {
                console.error("There was an error uploading the image")
                console.log(uploadResp)
            }
        },
    },
}

export default ImageUploadMixin
