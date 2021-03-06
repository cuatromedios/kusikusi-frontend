<template>
  <div>
    <q-dialog v-model="open" @hide="closeDialog">
      <q-uploader
          ref="uploader"
          style="width: 36em; max-width: 90vw"
          field-name="file"
          :headers="[{ name: 'Authorization', value: 'Bearer ' + $store.state.session.authtoken }]"
          :url="uploadUrl"
          @added="added"
          @uploaded="uploaded"
      >
        <template v-slot:header="scope">
          <q-toolbar class="bg-primary">
            <q-toolbar-title>
              {{ $t('media.uploader') }}
            </q-toolbar-title>
            <q-btn flat round dense icon="close" @click="closeDialog" />
          </q-toolbar>
        </template>
        <template v-slot:list="scope">
          <div class="row justify-around">
            <q-btn outline
                   :size="scope.files.length === 0 ? 'lg' : 'md'"
                   class="full-width"
                   :class="{'q-py-xl': scope.files.length === 0}"
                   style="border-style: dashed"
                   v-if="scope.files.length === 0"
            >
              <q-uploader-add-trigger />
              {{ $t('media.select')}}
            </q-btn>
          </div>
          <lang-tabs v-if="scope.files.length > 0"/>
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
                <q-item-label v-for="lang in $store.state.ui.config.langs"
                        :key="lang">
                  <q-input :filled="true"
                           dense
                           v-show="$store.state.ui.editorLang === lang"
                           v-model="titles[file.name][lang].title"
                           :label="$t('content.editor.title')"
                           :debounce="250"
                  />
                </q-item-label>
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
            <q-btn flat @click="closeDialog">{{ $t('general.cancel')}}</q-btn>
            <q-btn color="positive" @click="startUpload" :disabled="uploading" :loading="uploading">{{ $t('media.upload')}}</q-btn>
          </div>
        </template>
      </q-uploader>
    </q-dialog>
  </div>
</template>

<script>
import LangTabs from '../LangTabs'
import Vue from 'vue'
export default {
  components: { LangTabs },
  name: 'MediumDialog',
  props: {
    entityId: {
      type: String,
      default: null
    }
  },
  watch: {
    'entityId': function () {
      this.changed()
    }
  },
  data () {
    return {
      open: false,
      newEntityId: null,
      uploading: false,
      titles: {}
    }
  },
  computed: {
    showDialog () {
      return this.entityId !== null
    },
    uploadUrl () {
      return `${process.env.API_URL}/media/${this.newEntityId}/upload`
    }
  },
  methods: {
    closeDialog () {
      this.open = false
      this.$emit('closed')
    },
    changed () {
      this.open = this.entityId !== null
    },
    async startUpload () {
      this.uploading = true
      for (let f = 0; f < this.$refs.uploader.files.length; f++) {
        let file = this.$refs.uploader.files[f]
        let filenameParts = file.name.split('.')
        let format = filenameParts[filenameParts.length - 1].toLowerCase()
        let entity = {
          parent_id: 'media',
          model: 'medium',
          medium: {
            size: file.size,
            filename: file.name,
            mimetype: file.type,
            format: format
          },
          contents: this.titles[file.name]
        }
        let createResult = await this.$api.post(`/media`, entity)
        if (createResult.success) {
          let relationResult = await this.$api.post(`/entity/${this.$store.state.content.entity.id}/relations`, { kind: 'medium', id: createResult.result.id })
          this.newEntityId = createResult.result.id
          if (relationResult.success) {
            this.$nextTick(() => {
              this.$refs.uploader.upload()
            })
          }
        }
      }
    },
    added (files) {
      for (let f = 0; f < files.length; f++) {
        Vue.set(this.titles, files[f].name, {})
        for (let l = 0; l < this.$store.state.ui.config.langs.length; l++) {
          Vue.set(this.titles[files[f].name], this.$store.state.ui.config.langs[l], {})
          Vue.set(this.titles[files[f].name][this.$store.state.ui.config.langs[l]], 'title', this._.sentenceFromFilename(files[f].name))
        }
      }
    },
    uploaded (info) {
      this.closeDialog()
      this.uploading = false
      this.$router.go()
    }
  }
}
</script>

<style lang="stylus">
.media-strip
  overflow hidden
</style>
