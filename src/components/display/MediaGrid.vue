<template>
  <q-card flat bordered class="my-card q-mb-lg media-strip">
    <q-card-section>
      <h2><q-icon name="photo_library"/> {{ $t('media.title') }}</h2>
      <q-btn class="absolute-top-right q-ma-md" outline color="positive"  icon="add_circle"  :label="`${$t('general.add')} ${$t('media.singular')}`" @click="setMediumDialog('new')" />
    </q-card-section>
    <q-card-section>
      <div class="row wrap q-col-gutter-md q-mt-xs justify-center items-stretch">
        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-1"
             v-for="medium in $store.getters['content/getRelationsByKind']('medium')"
             :key="medium.id">
          <medium-card :entity="medium" :tags="tags"/>
        </div>
      </div>
    </q-card-section>
    <MediumDialog :entity-id="currentMediumId" @closed="currentMediumId = null" />
  </q-card>
</template>

<script>
import MediumDialog from '../edit/MediumDialog'
import MediumCard from './elements/MediumCard'
export default {
  name: 'MediaGrid',
  components: { MediumDialog, MediumCard },
  props: {
    tags: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      currentMediumId: null,
      showTagEditor: false
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
