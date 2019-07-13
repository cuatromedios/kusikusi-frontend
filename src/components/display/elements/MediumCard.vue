<template>
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
    <div v-if="['jpg', 'png', 'gif'].indexOf(entity.medium.format) === -1"
         class="flex flex-center bg-grey full-width text-white square">
      <q-avatar
          icon="attachment"
          color="grey-5"
          text-color="white" size="64px"
      />
    </div>
    <q-card-section class="absolute-top-right q-pa-xs"
                    v-if="tags && tags.length > 0"
                    @click="openTagEditor">
      <q-chip v-for="(tag, index) in entity.tags"
              :key="index"
              dense class="float-right cursor-pointer"
              icon="local_offer">
        {{ tag }}
      </q-chip>
    </q-card-section>
    <q-card-section v-show="showTagEditor" class="absolute-top q-pa-sm bg-white" v-if="tags && tags.length > 0">
      <q-select
          ref="tagEditor"
          v-model="entity.tags"
          multiple
          outlined
          :dense="true"
          :options-dense="true"
          :options="tags"
          use-chips
          :label="$t('media.tags')"
          @mouseleave="hideTagEditor"
          @input="updateMediaRelation"
      />
    </q-card-section>
    <q-card-actions align="around" class="media-card-actions">
      <div class="media-card-actions-title" style="width: 80%">
        <span>{{ entity.medium.filename }}</span><br>
        <span class="text-grey-5">{{ Math.round(entity.medium.size / 1024) }} Kb</span>
      </div>
      <q-btn style="width: 20%" flat size="small" dense icon="delete" color="grey-4" @click="deleteRelation"></q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
export default {
  name: 'MediumCard',
  props: {
    entity: {
      type: Object,
      default: null
    },
    tags: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      showTagEditor: false
    }
  },
  computed: {
    mediaUrl () {
      return process.env.MEDIA_URL
    }
  },
  methods: {
    async deleteRelation () {
      await this.$api.delete(`/entity/${this.$store.state.content.entity.id}/relations/medium/${this.entity.id}`)
      this.$router.go()
    },
    async updateMediaRelation () {
      await this.$api.post(`/entity/${this.$store.state.content.entity.id}/relations`, { kind: 'medium', id: this.entity.id, depth: this.entity.depth, position: this.entity.position, tags: this.entity.tags })
    },
    openTagEditor () {
      this.showTagEditor = true
      this.$refs.tagEditor.showPopup()
    },
    hideTagEditor () {
      this.showTagEditor = false
      this.$refs.tagEditor.hidePopup()
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
