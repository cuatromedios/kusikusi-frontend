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
          <child-item
              :class="{'bg-white': index % 2 === 0, 'bg-grey-2': index % 2 !== 0}"
              v-for="(entity, index) in childrenList"
              :key="entity.id"
              :entity="entity"
              :tags="tags"
          />
        </draggable>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import draggable from 'vuedraggable'
import ChildItem from './elements/ChildItem'
export default {
  components: { draggable, ChildItem },
  name: 'Children',
  props: {
    label: {
      type: String,
      default: 'Children'
    },
    allowed: {
      type: Array,
      default: () => []
    },
    tags: {
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
