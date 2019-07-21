<template>
  <div>
    <q-input class="q-mb-sm"
             v-model="fieldReference"
             :filled="true"
             :label="$t(label)"
             :debounce="500"
             v-bind="props">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="fieldReference" mask="YYYY-MM-DD HH:mm" />
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time v-model="fieldReference" mask="YYYY-MM-DD HH:mm"/>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import FieldBase from '../FieldBase.js'
export default {
  name: 'DatetimeField',
  mixins: [FieldBase],
  props: ['label', 'props']
}
</script>

<style lang="stylus">
</style>
