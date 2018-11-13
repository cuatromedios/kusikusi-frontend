<template>
  <div class="q-my-md">
    <h4>{{ label }}</h4>
    <q-btn-group push class="q-ma-lg">
      <q-btn push color="tertiary" @click="createMedia = true" :loading="loading" >{{ 'content.media' | translate }}</q-btn>
      <q-btn push color="red" :loading="loading" @click="deleteMedia(checkDeleteMedia)" :disable="disable">{{ 'content.delete' | translate }}</q-btn>
    </q-btn-group>
    <q-list>
      <q-item
          v-for="media in this.media"
          v-bind:key="media.id"
          class="dark">
        <div>
          <q-item-main @click.native="$router.push(`/media/edit/${media.id}`)">
            <img :src="media.src" :title="media.name">
            <q-item-tile>{{ media.name }}</q-item-tile>
          </q-item-main>
          <q-checkbox class="q-ma-md absolute-top-left" v-model="checkDeleteMedia" :val="media.id" @input="disableMediaButton"/>
          <q-select
            multiple
            chips
            inverted
            dark
            color="primary"
            float-label="Etiquetas:"
            v-model="media.tags"
            :options="selectableTags"
            @input="updateTag(media.id, media.tags)"
          />
        </div>
      </q-item>
    </q-list>
    <q-modal v-model="createMedia" :content-css="{minWidth: '80vw', minHeight: '80vh'}" @hide="createMedia = false">
      <EditMedia :relation="entity.id" :close="createMedia" :reload="reload" :filter="filter"></EditMedia>
      <q-btn class="q-ma-lg absolute-top-right" round color="negative" @click="createMedia = false" icon="fa fa-times" size="xs"></q-btn>
    </q-modal>
  </div>
</template>

<script>
import EditMedia from '../editMedia'
import Connection from '../../Connection'
import config from '../../config'
import Notifications from '../notifications.js'
export default {
  name: 'Media',
  mounted () {
    this.getMediaRelated()
  },
  components: {
    EditMedia
  },
  props: {
    label: {
      default: 'Medios',
      type: String
    },
    entity: {
      default: () => {
        return {}
      },
      type: Object
    },
    tags: {},
    filter: {},
    reload: {}
  },
  data () {
    return {
      loading: false,
      disable: true,
      createMedia: false,
      checkDeleteMedia: [],
      media: [],
      selectableTags: []
    }
  },
  methods: {
    getMediaRelated: async function () {
      let mediums
      let tag
      let mediaResult = await Connection.get(`/entity/${this.entity.id}/relations/medium?fields=e.id,e.name,r.tags`)
      if (mediaResult.success) {
        for (let i = 0; i < mediaResult.data.length; i++) {
          mediums = {'id': mediaResult.data[i].id, 'name': mediaResult.data[i].name, 'src': `${config.media.url}/${mediaResult.data[i].id}/thumb`, 'tags': mediaResult.data[i].relation.tags}
          this.media.push(mediums)
        }
      }
      for (let t = 0; t < this.tags.length; t++) {
        tag = {'label': this.tags[t], 'value': this.tags[t]}
        this.selectableTags.push(tag)
      }
    },
    deleteMedia: async function (entity) {
      // TODO: delete relation as well
      for (let i = 0; i < entity.length; i++) {
        this.loading = true
        let deleteResult = await Connection.delete(`/media/${entity[i]}`)
        if (deleteResult.success) {
          let deleteEntityResult = await Connection.delete(`/entity/${entity[i]}`)
          if (deleteEntityResult.success) {
            this.loading = false
            Notifications.notifySuccess(this.$t(`Media deleted successfully`))
          } else {
            this.loading = false
            Notifications.notifyError(this.$t(`Media deleted, but couldn't delete the entity itself`))
          }
        } else {
          Notifications.notifyError(this.$t(`Failed at deleting ${this.entityMedia.name}'s media`))
        }
      }
      this.checkDeleteMedia = []
      this.disableMedia = true
      setTimeout(() => this.reload(), 1500)
    },
    disableMediaButton: function () {
      this.checkDeleteMedia.length === 0 ? this.disable = true : this.disable = false
    },
    updateTag: async function (id, tags) {
      // console.log(tags)
      let data = {
        'kind': 'medium',
        'id': id,
        'tags': tags
      }
      let updateTagsResult = await Connection.post(`/entity/${this.entity.id}/relations`, data)
      if (!updateTagsResult.success) {
        Notifications.notifyError(this.$t(`Fail at updating tags`))
      }
    }
  }
}
</script>

<style scoped>

</style>
