<template>
  <q-card flat bordered class="my-card q-mb-lg ">
    <q-card-section>
      <h2><q-icon name="list_alt"/> {{ label }}</h2>
      <q-btn-dropdown class="absolute-top-right q-ma-md" outline color="positive"  icon="add_circle"  :label="$t('general.add')" v-if="settings.allowed && settings.allowed.length > 1">
        <q-list>
          <q-item clickable v-close-popup
                  v-for="model in settings.allowed"
                  @click="$router.push({name: 'contentNew', params: {entity_id: 'new', parent_id: $store.state.content.entity.id, model: model}})"
                  :key="model">
            <q-item-section>
              <q-item-label>{{ $store.state.ui.config.models[model] ? $store.state.ui.config.models[model].name : model }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn class="absolute-top-right q-ma-md" outline color="positive"  icon="add_circle"  :label="`${$t('general.add')} ${$store.state.ui.config.models[allowed[0]].name}`" v-if="settings.allowed && settings.allowed.length === 1" />
    </q-card-section>
    <q-card-section class="q-mt-md">
      <q-list bordered separator>
        <q-item clickable v-ripple
                v-for="entity in $store.state.content.children"
                :key="entity.id"
                :to="{name: 'content', params: {entity_id: entity.id}}">
          <q-item-section>{{ entity.name || entity.model }}</q-item-section>
          <q-item-section avatar>
            <q-icon color="grey" name="chevron_right" />
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
    settings: {
      type: Object,
      default: () => { return {} }
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
