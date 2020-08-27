<template>
    <div class="home" style="margin: 5rem;">
        <h1>Image API Test Client</h1>
        <div style="margin: 5rem;">
            <s3Uploader ref="uploader" @onUploadBegun="onUploadBegun" @onUploadComplete="onUploadComplete" />
        </div>

        <div>
            <p class="font-size: 2rem">Status: {{status}}</p>
            <!-- <p v-if="imageKey" class="font-size: 2rem">Image Key: {{imageKey}}</p> -->
        </div>

        <div style="margin: 5rem;">
            <button v-if="imageKey" @click="onClickWatermark">Watermark</button>
            <br>
            <button v-if="imageKey" @click="onClickPublish" style="margin-top: 1rem">Publish</button>
        </div>

        <p v-if="imageUrl" class="font-size: 2rem"><a target="_blank" :href="imageUrl">{{imageUrl}}</a></p>
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
            imageKey: '',
            imageUrl: null
        }
    },
    components: {
        s3Uploader
    },
    methods: {
        onUploadBegun() {
            this.status = 'Uploading image...'
            this.imageKey = ''
            this.imageUrl = null
        },
        onUploadComplete(imageKey) {
            this.status = 'Image uploaded'
            this.imageKey = imageKey
        },
        async onClickWatermark() {
            this.status = 'Watermarking image...'

            const watermarkOptions = {
                dark: false,
                gravity: 'south',
                width: 300,
                bottom: 20,
            }
            const result = await this.watermarkImage(this.imageKey, watermarkOptions)

            this.status = 'Watermark Complete'
        },
        async onClickPublish() {
            this.status = 'Publishing image...'

            this.imageUrl = await this.publishImage(this.imageKey)

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