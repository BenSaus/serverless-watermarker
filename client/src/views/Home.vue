<template>
    <div class="home" style="margin: 5rem;">
        <h1>Image API Test Client</h1>
        <div style="margin: 5rem;">
            <s3Uploader ref="uploader" @onUploadBegun="onUploadBegun" @onUploadComplete="onUploadComplete" />
        </div>

        <div>
            <p class="font-size: 2rem">Status: {{status}}</p>
            <p v-if="imageKey" class="font-size: 2rem">Image Key: {{imageKey}}</p>
        </div>

        <div style="margin: 5rem;">
            <button @click="onClickWatermark">Watermark</button>
            <button @click="onClickPublish">Publish</button>
        </div>

    </div>
</template>

<script>
import s3Uploader from '@/components/s3Uploader.vue'
import ImageAPIMixin from '@/mixins/ImageAPIMixin'

export default {
    name: 'Home',
    mixins: [ImageAPIMixin],
    data() {
        return {
            status: 'Waiting for image...',
            imageKey: ''
        }
    },
    components: {
        s3Uploader
    },
    methods: {
        onUploadBegun() {
            this.status = 'Uploading image...'
        },
        onUploadComplete(imageKey) {
            this.status = 'Image uploaded'
            this.imageKey = imageKey
        },
        async onClickWatermark() {
            console.log('Watermark')
            console.log(this.$refs.uploader.getImageData())

            this.status = 'Watermarking image...'

            const watermarkOptions = {
                dark: true,
                gravity: 'south',
                width: 300,
                bottom: 100,
            }
            const result = await this.watermarkImage(this.imageKey, watermarkOptions)
            console.log(result)

            this.status = 'Watermark Complete'
        },
        async onClickPublish() {
            console.log('Publish')
            console.log(this.$refs.uploader.getImageData())

            this.status = 'Publishing image...'

            const result = await this.publishImage(this.imageKey)
            console.log(result)

            this.status = 'Image Published'
        }
    }
}
</script>

<style lang="css">
    .watermarkControlDiv{
        width: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: flex-start;
        align-items: center;
    }
</style>