<template>
  <div>
    <q-dialog v-model="open">
      <q-card>
        <q-img src="https://media-cdn.tripadvisor.com/media/photo-s/0a/47/a8/91/chicken-salad-sandwich.jpg" />

        <q-card-section>
          <lang-tabs />
          <div class="text-subtitle1">$・Italian, Cafe</div>
          <div class="text-subtitle2 text-grey">Small plates, salads & sandwiches in an intimate setting.</div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat @click="closeDialog">{{ $t('general.cancel') }}</q-btn>
          <q-btn color="primary" v-close-popup>{{ $t('general.save') }}</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import LangTabs from '../LangTabs'
export default {
  components: { LangTabs },
  name: 'MediumDialog',
  props: {
    entityId: {
      type: String,
      default: null
    }
  },
  watch: {
    'entityId': function () {
      this.changed()
    }
  },
  data () {
    return {
      open: false
    }
  },
  computed: {
    showDialog () {
      return this.entityId !== null
    }
  },
  methods: {
    closeDialog () {
      this.open = false
      this.$emit('closed')
    },
    changed () {
      this.open = this.entityId !== null
    }
  }
}
</script>

<style lang="stylus">
.media-strip
  overflow hidden
</style>
