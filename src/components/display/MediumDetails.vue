<template>
  <q-card flat bordered class="my-card q-mb-lg">
    <q-card-section>
      <div class="row">
        <div class="col">
          <h2><q-icon name="view_list"/> {{ $t('media.details') }}</h2>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="row">
      <div class="col-xs-12 col-sm-5 col-md-4 col-lg-3 col-xl-2 outlined">
        <q-img
            :src="`${mediaUrl}/media/${entity.id}/thumb/file.${entity.medium.format}`"
            class=""
            v-if="['jpg', 'png', 'gif'].indexOf(_.get(entity, 'medium.format')) !== -1"
            basic
            :ratio="1"
        >
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-warning text-grey-8">
              Cannot load image
            </div>
          </template>
        </q-img>
        <div v-if="['jpg', 'png', 'gif'].indexOf(_.get(entity, 'medium.format')) === -1"
             class="flex flex-center bg-grey full-width text-white square">
          <q-avatar
              icon="attachment"
              color="grey-5"
              text-color="white" size="64px"
          />
        </div>
      </div>
      <div class="col-auto">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('media.filename') }}</q-item-label>
              <q-item-label class="text-weight-medium">{{ $store.state.content.entity.medium.filename || '-' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('media.format') }}</q-item-label>
              <q-item-label class="text-weight-medium">{{ $store.state.content.entity.medium.format || '-' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('media.mimetype') }}</q-item-label>
              <q-item-label class="text-weight-medium">{{ $store.state.content.entity.medium.mimetype || '-' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('media.size') }}</q-item-label>
              <q-item-label class="text-weight-medium">{{ $store.state.content.entity.medium.size | humanStorageSize }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('media.url') }}</q-item-label>
              <q-item-label class="text-weight-medium">{{ $store.state.content.entity.medium.url || '-' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { format } from 'quasar'
export default {
  name: 'MediumDetails',
  props: {},
  data () {
    return {
    }
  },
  computed: {
    entity () {
      return this.$store.state.content.entity
    },
    mediaUrl () {
      return process.env.MEDIA_URL
    }
  },
  methods: {},
  filters: {
    humanStorageSize: format.humanStorageSize
  }
}
</script>

<style lang="stylus">
</style>
