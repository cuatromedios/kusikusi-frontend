<template>
  <q-card flat bordered class="my-card q-mb-lg media-strip">
    <q-card-section>
      <h2><q-icon name="photo_library"/> {{ $t('media.title') }}</h2>
      <q-btn class="absolute-top-right q-ma-md" outline color="positive"  icon="add_circle"  :label="`${$t('general.add')} ${$t('media.singular')}`" @click="currentMediumId = 'new'" />
    </q-card-section>
    <q-card-section>
      <div class="row wrap q-col-gutter-sm q-pa-xs">
        <div class="media-container col-3 col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2"
             v-for="entity in $store.getters['content/getRelationsByKind']('medium')"
             :key="entity.id">
          <q-img
              src="https://cdn.quasar.dev/img/parallax2.jpg"
              class=""
              basic
              :ratio="1"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
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
  },
  methods: {
  }
}
</script>

<style lang="stylus">
</style>
