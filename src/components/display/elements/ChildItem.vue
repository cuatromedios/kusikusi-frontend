<template>
  <q-item>
    <q-item-section avatar><q-icon :name="$store.state.ui.config.models[entity.model] ? $store.state.ui.config.models[entity.model].icon : 'blur_on'"/></q-item-section>
    <q-item-section>
      <q-item-label class="text-body2 text-weight-bold text-primary" >
        <q-btn flat dense class="q-pa-none full-width ellipsis"
               align="left"
               :to="{name: 'contentDisplay', params: {entity_id: entity.id}}"
        >{{ entity.contents.title || entity.name || entity.model }}</q-btn>
      </q-item-label>
      <q-item-label caption>{{ entity.contents.url || '' }}</q-item-label>
    </q-item-section>
    <q-item-section side bottom>
      <q-item-label caption>{{ $moment(entity.publicated_at).fromNow() }} <q-icon name="lens" :color="entity.active ? (entity.published ? 'positive' : 'warning') : 'negative'" /> <q-icon name="info">
        <q-popup-proxy>
          <q-card>
            <q-card-section class="text-caption">
              ID: <strong style="white-space: nowrap">{{ entity.id }}</strong><br>
              Model: <strong>{{ entity.model }}</strong><br>
              Active: <strong>{{ entity.active }}</strong><br>
              From: <strong>{{ entity.publicated_at }}</strong><br>
              To: <strong>{{ entity.unpublicated_at }}</strong><br>
              Created: <strong>{{ entity.created_at }}</strong><br>
              Updated: <strong>{{ entity.updated_at }}</strong><br>
            </q-card-section>
          </q-card>
        </q-popup-proxy>
      </q-icon></q-item-label>
      <div>
        <q-chip v-if="tags && tags.length > 0 && notUsedTags.length > 0"
                dense outline
                color="positive" text-color="white"
                icon-right="add"
                class="float-right cursor-pointer">
          <q-avatar icon="local_offer" text-color="grey" />
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
      </div>
    </q-item-section>
  </q-item>
</template>
<script>
export default {
  name: 'ChildItem',
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
    notUsedTags () {
      return this._.difference(this.tags, this.entity.tags)
    }
  },
  methods: {
    async addTag (tag) {
      this.entity.tags.push(tag)
      this.updateTags()
    },
    async removeTag (tag) {
      this.entity.tags = this._.without(this.entity.tags, tag)
      this.updateTags()
    },
    async updateTags () {
      await this.$api.post(`/entity/${this.entity.id}/relations`, { kind: 'ancestor', id: this.$store.state.content.entity.id, depth: 1, position: this.entity.position, tags: this.entity.tags })
    }
  }
}
</script>

<style lang="stylus">
</style>
