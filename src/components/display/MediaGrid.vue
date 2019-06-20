<template>
  <q-card flat bordered class="my-card q-mb-lg media-strip">
    <q-card-section>
      <h2><q-icon name="photo_library"/> {{ $t('media.title') }}</h2>
      <q-btn class="absolute-top-right q-ma-md" outline color="positive"  icon="add_circle"  :label="`${$t('general.add')} ${$t('media.singular')}`" @click="setMediumDialog('new')" />
    </q-card-section>
    <q-card-section>
      <div class="row wrap q-col-gutter-sm q-pa-xs items-stretch">
        <div class="media-container col-3 col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2"
             v-for="entity in $store.getters['content/getRelationsByKind']('medium')"
             :key="entity.id">
          <q-img
              :src="`${mediaUrl}${entity.medium.thumb}`"
              class=""
              v-if="['jpg', 'png', 'gif'].indexOf(entity.medium.format) !== -1"
              basic
              :ratio="1"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
          <div style="background-color: azure">
            <q-icon
                name="attachment"
                style="font-size: 4.4em;"
                v-if="['jpg', 'png', 'gif'].indexOf(entity.medium.format) === -1"
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <MediumDialog :entity-id="currentMediumId" @closed="currentMediumId = null" />
  </q-card>
</template>

<script>
import MediumDialog from '../edit/MediumDialog'
export default {
  name: 'MediaGrid',
  components: { MediumDialog },
  props: {
  },
  data () {
    return {
      currentMediumId: null
    }
  },
  computed: {
    mediaUrl () {
      return process.env.MEDIA_URL
    }
  },
  methods: {
    setMediumDialog (id) {
      this.currentMediumId = null
      this.currentMediumId = id
    }
  }
}
</script>

<style lang="stylus">
</style>
