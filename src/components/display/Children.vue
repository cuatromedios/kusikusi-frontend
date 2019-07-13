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
      <q-btn class="absolute-top-right q-ma-md" outline color="positive"  icon="add_circle"  :label="`${$t('general.add')} ${$store.state.ui.config.models[allowed[0]].name}`" v-if="allowed && allowed.length === 1" />
    </q-card-section>
    <q-card-section class="q-mt-md">
      <q-list bordered separator>
        <q-item v-for="entity in $store.state.content.children"
                :key="entity.id">
          <q-item-section avatar><q-icon :name="$store.state.ui.config.models[entity.model] ? $store.state.ui.config.models[entity.model].icon : 'insert_drive_file'"/></q-item-section>
          <q-item-section>
            <q-item-label class="text-body2 text-weight-bold text-primary" >
              <q-btn flat dense class="q-pa-none" :to="{name: 'content', params: {entity_id: entity.id}}">{{ entity.name || entity.model }}</q-btn>
            </q-item-label>
            <q-item-label caption>{{ entity.model }}</q-item-label>
          </q-item-section>
          <q-item-section side bottom>
            <q-item-label caption>{{ $moment(entity.publicated_at).fromNow() }}  <q-icon name="lens" :color="entity.published ? 'positive' : 'negative'" /></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
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
  },
  methods: {
  }
}
</script>

<style lang="stylus">
</style>
