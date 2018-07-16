<template>
  <q-page class="flex flex-center">
    <q-item>
      <q-item-main>
        <q-card
          v-for="media in media"
          v-bind:key="media.id"
        >
          <q-card-media @click.native="$router.push(`/media/edit/${media.id}`)">
            <img :src="media.src" :title="media.name" style="cursor: pointer;">
          </q-card-media>
          <q-card-separator />
          <q-card-title @click.native="$router.push(`/media/edit/${media.id}`)" style="color: #0071bc; cursor: pointer;">
            {{ media.name }}
          </q-card-title>
        </q-card>
        <br>
      </q-item-main>
      <q-side>
        <q-btn class="q-ma-lg" color="primary" @click="$router.push(`/media/create`)" :loading="loading">Nuevo medio</q-btn>
      </q-side>
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
