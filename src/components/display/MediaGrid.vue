<template>
  <q-card flat bordered class="my-card q-mb-lg media-strip">
    <q-card-section>
      <h2><q-icon name="photo_library"/> {{ $t(label) }}</h2>
      <q-btn class="absolute-top-right q-ma-md" outline color="positive"  icon="add_circle"  :label="`${$t('general.add')} ${$t('media.singular')}`" @click="setMediumDialog('new')" />
    </q-card-section>
    <q-card-section>
      <draggable v-model="mediaList" class="row wrap q-col-gutter-md q-mt-xs justify-center items-stretch">
          <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-1"
               v-for="medium in mediaList"
               :key="medium.id" >
            <medium-card :entity="medium" :tags="tags"/>
          </div>
      </draggable>
    </q-card-section>
    <MediumDialog :entity-id="currentMediumId" @closed="currentMediumId = null" />
  </q-card>
</template>

<script>
import MediumDialog from '../edit/MediumDialog'
import MediumCard from './elements/MediumCard'
import draggable from 'vuedraggable'

export default {
  name: 'MediaGrid',
  components: { MediumDialog, MediumCard, draggable },
  props: {
    label: {
      type: String,
      default: 'media.title'
    },
    tags: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      currentMediumId: null
    }
  },
  computed: {
    mediaUrl () {
      return process.env.MEDIA_URL
    },
    mediaList: {
      get () {
        return this.$store.getters['content/getRelationsByKind']('medium')
      },
      set (value) {
        this.$store.dispatch('content/changeRelationsPosition', value)
      }
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
