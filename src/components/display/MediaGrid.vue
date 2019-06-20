<template>
  <q-card flat bordered class="my-card q-mb-lg media-strip">
    <q-card-section>
      <h2><q-icon name="photo_library"/> {{ $t('media.title') }}</h2>
      <q-btn class="absolute-top-right q-ma-md" outline color="positive"  icon="add_circle"  :label="`${$t('general.add')} ${$t('media.singular')}`" @click="setMediumDialog('new')" />
    </q-card-section>
    <q-card-section>
      <div class="row wrap q-col-gutter-md q-mt-xs justify-center items-stretch">
        <div class="col-3 col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2" v-for="entity in $store.getters['content/getRelationsByKind']('medium')"
             :key="entity.id">
          <q-card class="media-container">
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
            <div  v-if="['jpg', 'png', 'gif'].indexOf(entity.medium.format) === -1"
                  class="flex flex-center bg-grey full-width text-white square">
                <q-avatar
                    icon="attachment"
                    color="grey-5"
                    text-color="white" size="64px"
                />
            </div>
            <q-card-section class="q-pa-sm" v-if="tags && tags.length > 0">
              <q-select
                  v-model="entity.tags"
                  multiple
                  outlined
                  :dense="true"
                  :options-dense="true"
                  :options="tags"
                  use-chips
                  :label="$t('media.tags')"
                  @input="updateMediaRelation(entity)"
              />
            </q-card-section>
            <q-card-actions align="around" class="media-card-actions">
              <div class="media-card-actions-title" style="width: 80%">
                <span>{{ entity.medium.filename }}</span><br>
                <span class="text-grey-5">{{ Math.round(entity.medium.size / 1024) }} Kb</span>
              </div>
              <q-btn style="width: 20%" flat size="small" dense icon="link_off" color="grey" @click="deleteMedia(entity.id)"></q-btn>
            </q-card-actions>
          </q-card>
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
    }
  },
  methods: {
    setMediumDialog (id) {
      this.currentMediumId = null
      this.currentMediumId = id
    },
    async deleteMedia (mediaId) {
      await this.$api.delete(`/entity/${this.$store.state.content.entity.id}/relations/medium/${mediaId}`)
      this.$router.go()
    },
    async updateMediaRelation (media) {
      console.log(media)
      await this.$api.post(`/entity/${this.$store.state.content.entity.id}/relations`, { kind: 'medium', id: media.id, depth: media.depth, position: media.position, tags: media.tags })
      // this.$router.go()
    }
  }
}
</script>

<style lang="stylus">
  .media-card-actions
    height 3rem
    .media-card-actions-title
      overflow hidden
      text-overflow ellipsis
      font-size 0.9em
</style>
