<template>
  <div>
    <q-field label="Titulo:" class="q-mt-md">
      <q-input v-model="entity.contents.title" type="text" rows="1" class="q-mt-md"/>
    </q-field>
    <q-field label="Reseña:" class="q-mt-md">
      <q-input v-model="entity.contents.summary" type="text" :rows="3" class="q-mt-md"/>
    </q-field>
    <q-field label="Descripcion:" class="q-mt-md">
      <q-editor
        class="q-mt-md"
        v-model="entity.contents.description"
        :toolbar="toolbar"
        :fonts="fonts"
        toolbar-text-color="white"
        toolbar-toggle-color="yellow-8"
        toolbar-flat
        toolbar-bg="primary"
      />
    </q-field>
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    entity: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      toolbar: [
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        [
          {
            label: 'Formato',
            // icon: $q.icon.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
          },
          {
            label: 'Tamaño de fuente',
            // icon: $q.icon.editor.fontSize,
            list: 'no-icons',
            options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
          },
          {
            label: 'Courier New',
            // icon: $q.icon.editor.font,
            list: 'no-icons',
            options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        [
          {
            label: 'Alineación',
            // icon: $q.icon.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['undo', 'redo'],
        ['print', 'fullscreen']
      ],
      fonts: {
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }
    }
  }
}
</script>

<style scoped>

</style>
