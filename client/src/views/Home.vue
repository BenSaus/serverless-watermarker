<template>
    <div class="home" style="margin: 5rem;">
        <h1>Image API Test Client</h1>
        <div style="margin: 5rem;">
            <s3Uploader ref="uploader" />
        </div>
        <!-- <div>
            <div class="watermarkControlDiv" style="margin: 0 auto;">
                <label for="">Watermark Shade: </label>
                <select name="WatermarkDark" id="">
                    <option value="">Dark</option>
                    <option value="">Light</option>
                </select>

                <label for="">Watermark Gravity: </label>
                <select name="WatermarkDark" id="">
                    <option value="north">North</option>
                    <option value="south">South</option>
                </select>

                <label for="">Watermark Width: </label>
                <input type="text">
                <label for="">Watermark Top: </label>
                <input type="text">
                <label for="">Watermark Bottom: </label>
                <input type="text">
            </div>
        </div> -->
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
    components: {
        s3Uploader
    },
    methods: {
        async onClickWatermark() {
            console.log('Watermark')
            console.log(this.$refs.uploader.getImageData())
            const imageKey = this.$refs.uploader.getImageData().key

            const watermarkOptions = {
                dark: true,
                gravity: 'south',
                width: 300,
                bottom: 100,
            }
            const result = await this.watermarkImage(imageKey)

            console.log(result)
            
        },
        async onClickPublish() {
            console.log('Publish')
            console.log(this.$refs.uploader.getImageData())
            const imageKey = this.$refs.uploader.getImageData().key
            const result = await this.publishImage(imageKey)

            console.log(result)
            
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