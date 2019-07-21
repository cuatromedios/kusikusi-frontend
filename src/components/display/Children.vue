<template>
  <q-card flat bordered class="my-card q-mb-lg ">
    <q-card-section>
      <h2><q-icon name="list_alt"/> {{ label }}</h2>
      <q-btn-dropdown class="absolute-top-right q-ma-md" outline color="positive"  icon="add_circle"  :label="$t('general.add')" v-if="allowed && allowed.length > 1">
        <q-list>
          <q-item clickable v-close-popup
                  v-for="model in allowed"
                  @click="$router.push({name: 'contentNew', params: {entity_id: 'new', parent_id: $store.state.content.entity.id, model: model}})"
                  :key="model">
            <q-item-section>
              <q-item-label>{{ $store.state.ui.config.models[model] ? $store.state.ui.config.models[model].name : model }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn class="absolute-top-right q-ma-md"
             outline color="positive"  icon="add_circle"
             :label="`${$t('general.add')} ${$store.state.ui.config.models[allowed[0]].name}`" v-if="allowed && allowed.length === 1"
             @click="$router.push({name: 'contentNew', params: {entity_id: 'new', parent_id: $store.state.content.entity.id, model: allowed[0]}})"
      />
    </q-card-section>
    <q-card-section class="q-mt-md">
      <q-list bordered separator>
        <draggable v-model="childrenList">
          <q-item v-for="entity in childrenList"
                  class="bg-white"
                  :key="entity.id">
            <q-item-section avatar><q-icon :name="$store.state.ui.config.models[entity.model] ? $store.state.ui.config.models[entity.model].icon : 'insert_drive_file'"/></q-item-section>
            <q-item-section>
              <q-item-label class="text-body2 text-weight-bold text-primary" >
                <q-btn flat dense class="q-pa-none full-width"
                       align="left"
                       :to="{name: 'contentDisplay', params: {entity_id: entity.id}}"
                >{{ entity.contents.title || entity.name || entity.model }}</q-btn>
              </q-item-label>
              <q-item-label caption>{{ entity.contents.url || '' }}</q-item-label>
            </q-item-section>
            <q-item-section side bottom>
              <q-item-label caption>{{ $moment(entity.publicated_at).fromNow() }}  <q-icon name="lens" :color="entity.published ? 'positive' : 'negative'" /></q-item-label>
            </q-item-section>
          </q-item>
        </draggable>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: { draggable },
  name: 'Children',
  props: {
    label: {
      type: String,
      default: 'Children'
    },
    allowed: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  computed: {
    childrenList: {
      get () {
        return this.$store.state.content.children
      },
      set (value) {
        this.$store.dispatch('content/changeChildrenPosition', value)
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus">
</style>
