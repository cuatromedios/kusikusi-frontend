<template>
  <q-page class="flex flex-center">
    <q-btn class="q-ma-lg" color="primary" @click="$router.push(`/media/edit`)" :loading="loading">Nuevo medio</q-btn>
    <q-item class="q-ma-md"
            v-for="media in this.media"
            v-bind:key="media.id"
            @click.native="$router.push(`/media/edit/${media.id}`)"
            style="color: #2e3436; cursor: pointer;">
      <img :src="media.src" :title="media.name">
    </q-item>
  </q-page>
</template>

<script>
import Connection from '../Connection'
import config from '../config'
export default {
  name: 'Gallery',
  mounted () {
    this.getMedia()
  },
  data () {
    return {
      loading: false,
      media: []
    }
  },
  methods: {
    getMedia: async function () {
      let mediums
      let mediumsIdResult = await Connection.get(`/entity/media/children?fields=e.id,e.name`)
      if (mediumsIdResult.success) {
        for (let i = 0; i < mediumsIdResult.data.length; i++) {
          mediums = {'id': mediumsIdResult.data[i].id, 'name': mediumsIdResult.data[i].name, 'src': `${config.media.url}/${mediumsIdResult.data[i].id}/thumb`}
          this.media.push(mediums)
        }
      }
    }
  }
}
</script>

<style>
</style>
