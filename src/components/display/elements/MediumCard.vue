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
                   >
      <q-chip v-if="tags && tags.length > 0"
              dense
              color="positive" text-color="white"
              icon-right="add"
              class="float-right cursor-pointer">
        <q-avatar icon="local_offer" color="grey-5" text-color="white" />
        {{ $t('general.add') }} {{ $t('media.tag') }}
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item v-for="(tag, index) in notUsedTags"
                    :key="index"
                    @click="addTag(tag)"
                    dense clickable v-close-popup>
              <q-item-section>{{ tag }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-chip>
      <q-chip v-for="(tag, index) in entity.tags"
              :key="index"
              removable
              @remove="removeTag(tag)"
              dense class="float-right"
              >
        <q-avatar icon="local_offer" color="grey-5" text-color="white" />
        {{ tag }}
      </q-chip>
    </q-card-section>
    <q-card-actions align="around" class="media-card-actions">
      <div class="media-card-actions-title" style="width: 80%">
        <span class="ellipsis">{{ entity.medium.filename || entity.id }}</span><br>
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
    }
  },
  computed: {
    mediaUrl () {
      return process.env.MEDIA_URL
    },
    notUsedTags () {
      return this._.difference(this.tags, this.entity.tags)
    }
  },
  methods: {
    async deleteRelation () {
      this.$q.dialog({
        title: this.$t('general.confirm'),
        message: this.$t('general.sure'),
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await this.$api.delete(`/entity/${this.$store.state.content.entity.id}/relations/medium/${this.entity.id}`)
        this.$router.go()
      })
    },
    async addTag (tag) {
      this.entity.tags.push(tag)
      this.updateTags()
    },
    async removeTag (tag) {
      console.log(tag)
      this.entity.tags = this._.without(this.entity.tags, tag)
      this.updateTags()
    },
    async updateTags () {
      await this.$api.post(`/entity/${this.$store.state.content.entity.id}/relations`, { kind: 'medium', id: this.entity.id, depth: this.entity.depth, position: this.entity.position, tags: this.entity.tags })
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
