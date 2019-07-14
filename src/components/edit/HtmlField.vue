<template>
  <div>
    <div class="bg-grey-2 q-px-md q-py-sm">
      {{ $t(label) }}
    </div>
    <q-editor class="q-mb-sm no-border no-border-radius"
              toolbar-bg="grey-3"
              ref="editor_ref"
              content-class="bg-grey-1"
              :filled="true"
              v-model="fieldReference"
              :debounce="1000"
              :definitions="{
                p2: {cmd: 'formatBlock', param: 'P', icon: 'format_size', tip: 'Paragraph'},
              }"
              :toolbar="[
                [{
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: ['p2', 'h1','h2','h3', 'h4', 'h5', 'h6', 'code']
                },'removeFormat'],
                ['bold', 'italic', 'strike', 'underline'],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
                ['link'],
              ]"
              @paste.native="evt => pasteCapture(evt)"
              v-bind="props"
              min-height="5rem"
    />
  </div>
</template>

<script>
import FieldBase from '../FieldBase.js'
export default {
  name: 'HtmlField',
  mixins: [FieldBase],
  props: {
    label: {
      type: String,
      default: ''
    },
    props: {
      type: Object,
      default: () => { return {} }
    }
  },
  mounted () {
    document.execCommand('defaultParagraphSeparator', false, 'p')
  },
  methods: {
    /**
     * Capture the <CTL-V> paste event, only allow plain-text, no images.
     *
     * see: https://stackoverflow.com/a/28213320
     *
     * @param {object} evt - array of files
     * @author Daniel Thompson-Yvetot
     * @license MIT
     */
    pasteCapture (evt) {
      let text, onPasteStripFormattingIEPaste
      evt.preventDefault()
      if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
        text = evt.originalEvent.clipboardData.getData('text/plain')
        this.$refs.editor_ref.runCmd('insertText', text)
      } else if (evt.clipboardData && evt.clipboardData.getData) {
        text = evt.clipboardData.getData('text/plain')
        this.$refs.editor_ref.runCmd('insertText', text)
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true
          this.$refs.editor_ref.runCmd('ms-pasteTextOnly', text)
        }
        onPasteStripFormattingIEPaste = false
      }
    }
  }
}
</script>

<style lang="stylus">
  div.q-editor div.q-editor__content, div.q-menu {
    h1, h2, h3, h4, h5, h6 {
      font-family "Arial", "Helvetica", "Sans-Serif"
      font-weight bold
      text-transform none
      color black
      margin 0 0 1rem 0
    }
    p {
      font-family "Arial", "Helvetica", "Sans-Serif"
      text-transform none
      color black
      margin 0 0 1rem 0
    }
    h1 {
      font-size 1.5rem
    }
    h2 {
      font-size 1.4rem
    }
    h3 {
      font-size 1.3rem
    }
    h4 {
      font-size 1.2rem
    }
    h5 {
      font-size 1.1rem
    }
    h6 {
      font-size 1rem
    }
    p {
      font-size 1rem
    }
  }
</style>
