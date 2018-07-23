<template>
  <q-collapsible icon="fa-image" label="Medios" header-class="bg-primary text-white icon-white" style="width: 80vw; max-width: 80vw;" class="q-my-md" v-if="formItems.media">
    <q-btn-group push class="q-ma-lg">
      <q-btn push color="tertiary" @click="createMedia = true" :loading="loading" >{{ 'content.media' | translate }}</q-btn>
      <q-btn push color="red" :loading="loading" @click="deleteMedia(checkDeleteMedia)" :disable="disableMedia">{{ 'content.delete' | translate }}</q-btn>
    </q-btn-group>
    <q-list v-if="this.media !== []">
      <q-item
          v-for="media in this.media"
          v-bind:key="media.id"
          class="dark">
        <div>
          <q-item-main @click.native="$router.push(`/media/edit/${media.id}`)">
            <img :src="media.src" :title="media.name">
            <q-item-tile>{{ media.name }}</q-item-tile>
          </q-item-main>
          <q-checkbox class="q-ma-md absolute-top-left" v-model="checkDeleteMedia" :val="media.id" @input="disableMediaButton"/>
        </div>
      </q-item>
    </q-list>
  </q-collapsible>
</template>

<script>
export default {
  name: 'Input',
  props: {
    field: {
      default: '',
      type: String
    },
    label: {
      default: '',
      type: String
    },
    entity: {
      default: () => {
        return {}
      },
      type: Object
    },
    params: {
      default: () => {
        return {
          type: 'text',
          rows: 3
        }
      },
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: {
    fieldReference: {
      get: function () {
        let fieldParts = this.field.split('.')
        if (fieldParts.length === 1) {
          return this.entity[fieldParts[0]]
        } else {
          return this.entity[fieldParts[0]][fieldParts[1]]
        }
      },
      set: function (value) {
        let fieldParts = this.field.split('.')
        if (fieldParts.length === 1) {
          this.entity[fieldParts[0]] = value
        } else {
          this.entity[fieldParts[0]][fieldParts[1]] = value
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
