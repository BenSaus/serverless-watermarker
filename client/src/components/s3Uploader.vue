<template>
    <div>
        <div>
            <img v-if="imageSrc" :src="imageSrc" class="previewBox"/>
            <input type="file"
                @change="onFileChange($event)"
                accept="image/*.jpg"
                class="input-file"
                ref="fileInput"
            >
        </div>
    </div>    
</template>

<script>
import ImageUploadMixin from '../mixins/ImageUploadMixin'


export default {
    name: 'ImageUpload',
    data() {
        return {
            isInitial: true,
            imageSrc: null,
            image_data: {},
        }
    },
    mixins: [
        ImageUploadMixin,
    ],
    methods: {
        async onFileChange (e) {
            this.displayImage(e.target.files[0])
            this.$emit('onUploadBegun')
    
            // The key is used to construct the url. It itself is not critical but for now I'm storing it anyway
            this.image_data.key = await this.uploadImage(this.$refs.fileInput.files[0])

            this.$emit('onUploadComplete', this.image_data.key)
        },
        async displayImage (file) {
            const reader = new FileReader()
            
            reader.onload = (e) => {
                if (!e.target.result.includes('data:image/jpeg')) {
                    return alert('Wrong file type - JPG only.')
                }

                this.imageSrc = e.target.result
            }

            // convert the blob to base64 data url for in-browser inline image display
            reader.readAsDataURL(file)
        },
        onClickClear() {
            this.image_data.key = null
            this.image_data.url = null
            this.imageSrc = null
        },
        getImageData() {
            return this.image_data
        }

    }
}


</script>

<style scoped>
    .previewBox{
        width: 100px;
        border: 1px solid black;
    }
</style>