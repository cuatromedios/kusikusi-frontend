<template>
  <q-card flat bordered class="my-card q-mb-lg ">
    <q-card-section>
      <h2><q-icon name="list_alt"/> {{ label }}</h2>
    </q-card-section>
    <q-card-section>
      <div class="row wrap q-col-gutter-sm q-pa-xs">
        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2"
             v-for="entity in $store.getters['content/getRelationsByKind']('medium')"
             :key="entity.id">
          <q-card>
            <q-img
                src="https://cdn.quasar.dev/img/parallax2.jpg"
                basic
            >
              <div class="absolute-bottom">
                {{ entity.name || entity.model }}
              </div>
            </q-img>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'Children',
  props: {
    label: {
      type: String,
      default: 'Media'
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
