<template>
  <q-list>
  <q-btn color="tertiary" size="md" class="q-ma-md float-right" v-model="localEdit" @click="localEdit = true"><q-icon name="fa fa-edit" color="white" /></q-btn>
    <q-item>
      <q-item-main style="color: black;">
        <q-item-tile>
          <div :is="tag">{{ mainTitle }}</div>
        </q-item-tile>
        <q-item-tile>
          <p>{{ mainSubTitle }}</p>
        </q-item-tile>
        <q-item-tile>
          <div
            v-for="media in media"
            v-bind:key="media.id">
            <img :src="media.src" :title="media.name">
          </div>
        </q-item-tile>
      </q-item-main>
    </q-item>
  </q-list>
</template>

<script>
import Connection from '../../Connection'
import config from '../../config'
export default {
  name: 'EntityCard',
  props: {
    titleSize: {
      type: Number,
      default: 3
    },
    edit: {},
    entity: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      result: []
    }
  },
  computed: {
    mainTitle: function () {
      if (this.entity.contents.length === 0 || this.entity.contents.title === '') {
        return this.entity.name
      } else {
        return this.entity.contents.title
      }
    },
    mainSubTitle: function () {
      if (this.entity.contents.length === 0 || this.entity.contents.summary === '') {
        return this.entity.summary
      } else {
        return this.entity.contents.summary
      }
    },
    media: function () {
      let mediums
      let urls = []
      // this.getMediaRelated()
      if (this.result.success) {
        for (let i = 0; i < this.result.data.length; i++) {
          mediums = {'id': this.result.data[i].id, 'name': this.result.data[i].name, 'src': `${config.media.url}/${this.result.data[i].id}/icon`}
          urls.push(mediums)
        }
        return urls
      }
    },
    tag: function () {
      let headerLevel = this.titleSize
      if (isNaN(this.titleSize) || this.titleSize < 2) {
        headerLevel = 2
      }
      return ('h' + String(headerLevel))
    },
    localEdit: {
      get: function () {
        return this.edit
      },
      set: function (update) {
        this.$emit('update:edit', update)
      }
    }
  },
  methods: {
    getMediaRelated: async function () {
      let mediaResult = await Connection.get(`/entity/${this.entity.id}/relations/medium?fields=e.id,e.name`)
      this.result = mediaResult
    }
  }
}
</script>

<style scoped>

</style>
