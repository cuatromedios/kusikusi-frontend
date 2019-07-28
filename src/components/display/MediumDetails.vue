<template>
  <q-card flat bordered class="my-card q-mb-lg">
    <q-card-section>
      <div class="row">
        <div class="col">
          <h2><q-icon name="view_list"/> {{ $t('media.details') }}</h2>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="row">
      <div class="col-xs-12 col-sm-5 col-md-4 col-lg-3 col-xl-2">
        <q-uploader
            ref="uploader"
            class="full-width"
            field-name="file"
            :headers="[{ name: 'Authorization', value: 'Bearer ' + $store.state.session.authtoken }]"
            :url="uploadUrl"
            @added="added"
            @uploaded="uploaded"
        >
          <template v-slot:header="scope" />
          <template v-slot:list="scope">
            <q-btn outline dense
                   size="sm"
                   class="full-width"
                   style="border-style: dashed"
                   v-if="scope.files.length === 0"
            >
              <q-uploader-add-trigger />
              <q-img
                  :src="`${mediaUrl}/media/${entity.id}/thumb/file.${entity.medium.format}`"
                  class=""
                  v-if="['jpg', 'png', 'gif'].indexOf(_.get(entity, 'medium.format')) !== -1"
                  basic
                  @click="scope.pickFiles"
                  :ratio="1"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-warning text-grey-8">
                    Cannot load image
                  </div>
                </template>
              </q-img>
              <div v-if="['jpg', 'png', 'gif'].indexOf(_.get(entity, 'medium.format')) === -1"
                   class="flex flex-center bg-grey full-width text-white square">
                <q-avatar
                    icon="attachment"
                    color="grey-5"
                    text-color="white" size="64px"
                />
              </div>
              {{ $t('media.select')}}
            </q-btn>
            <q-list>
              <q-item v-for="file in scope.files" :key="file.name">
                <q-item-section
                    v-if="file.__img"
                    class="gt-xs"
                    avatar
                >
                  <q-img :src="file.__img.src" :ratio="1" style="width: 4em; height: 4em" contain/>
                </q-item-section>
                <q-item-section
                    v-if="!file.__img"
                    class="gt-xs"
                    avatar
                >
                  <q-icon name="attachment" style="width: 3.5rem; height: 4rem"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="full-width ellipsis">
                    {{ file.name }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ $t('media.status.title') }}: {{ $t(`media.status.${file.__status}`) }}
                  </q-item-label>
                  <q-linear-progress stripe style="height: 2px; " :color="file.__status === 'failed' ? 'negative' : 'positive'" :value="file.__progress"  />
                </q-item-section>
                <q-item-section top side>
                  <q-btn
                      class="gt-xs"
                      size="12px"
                      color="grey-4"
                      flat
                      dense
                      round
                      icon="delete"
                      @click="scope.removeFile(file)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <div class="row justify-around q-mt-md" v-if="scope.files.length !== 0">
              <q-btn flat @click="scope.reset()">{{ $t('general.cancel')}}</q-btn>
              <q-btn color="positive" @click="startUpload" :disabled="uploading" :loading="uploading">{{ $t('media.upload')}}</q-btn>
            </div>
          </template>
        </q-uploader>
      </div>
      <div class="col-auto">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('media.filename') }}</q-item-label>
              <q-item-label class="text-weight-medium">{{ $store.state.content.entity.medium.filename || '-' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('media.format') }}</q-item-label>
              <q-item-label class="text-weight-medium">{{ $store.state.content.entity.medium.format || '-' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('media.mimetype') }}</q-item-label>
              <q-item-label class="text-weight-medium">{{ $store.state.content.entity.medium.mimetype || '-' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('media.size') }}</q-item-label>
              <q-item-label class="text-weight-medium">{{ $store.state.content.entity.medium.size | humanStorageSize }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('media.url') }}</q-item-label>
              <q-item-label class="text-weight-medium">{{ $store.state.content.entity.medium.url || '-' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { format } from 'quasar'
export default {
  name: 'MediumDetails',
  props: {},
  data () {
    return {
      uploading: false
    }
  },
  computed: {
    entity () {
      return this.$store.state.content.entity
    },
    mediaUrl () {
      return process.env.MEDIA_URL
    },
    uploadUrl () {
      return `${process.env.API_URL}/media/${this.$store.state.content.entity.id}/upload`
    }
  },
  methods: {
    added (files) {
    },
    uploaded () {
      this.uploading = false
      this.$router.go()
    },
    async startUpload () {
      this.uploading = true
      for (let f = 0; f < this.$refs.uploader.files.length; f++) {
        let file = this.$refs.uploader.files[f]
        let filenameParts = file.name.split('.')
        let format = filenameParts[filenameParts.length - 1].toLowerCase()
        let entity = {
          medium: {
            size: file.size,
            filename: file.name,
            mimetype: file.type,
            format: format
          }
        }
        await this.$api.patch(`/entity/${this.$store.state.content.entity.id}`, entity)
        this.$refs.uploader.upload()
      }
    }
  },
  filters: {
    humanStorageSize: format.humanStorageSize
  }
}
</script>

<style lang="stylus">
</style>
