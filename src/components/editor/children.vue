<template>
  <q-collapsible icon="fa-list" label="Contenido" opened header-class="bg-primary text-white icon-white" style="width: 80vw; max-width: 80vw;" class="q-my-md" v-if="formItems.content">
    <q-btn-group push class="q-ma-lg">
      <q-btn-dropdown push color="tertiary" :label="'content.save child' | translate" :loading="loading">
        <q-list link>
          <q-item v-for="model in this.modelsData.allowedChild" :key="model.value" @click.native="createEntity(model.value)">
            <q-item-tile label style="color: #000000;">{{ model.value }}</q-item-tile>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn push color="red" :loading="loading" @click="deleteEntitiesArray(checkDeleteContent)" :disable="disableContent">{{ 'content.delete' | translate }}</q-btn>
    </q-btn-group>
    <q-list
            v-for="children in this.children"
            v-bind:key="children.id"
            @click.native="$router.push(`/content/edit/${children.id}`)"
            class="dark">
      <q-item>
        <q-item-side>
          <q-checkbox v-model="checkDeleteContent" color="primary" :val="children.id" @input="disableContentButton"/>
        </q-item-side>
        <q-item-main>
          <strong style="color: #0071bc;">- {{ children.name }}</strong>
        </q-item-main>
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
