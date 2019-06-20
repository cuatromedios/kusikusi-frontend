<template>
  <div>
    <q-dialog v-model="open">
      <q-uploader
          url="http://localhost:4444/upload"
          multiple
          style="width: 36em; max-width: 90vw"
      >
        <template v-slot:list="scope">
          <div class="row justify-around">
            <q-btn outline
                   :size="scope.files.length === 0 ? 'lg' : 'md'"
                   class="full-width"
                   :class="{'q-py-xl': scope.files.length === 0}"
                   @click="scope.pickFiles"
                   style="border-style: dashed"
            >{{ $t('media.select')}}
            </q-btn>
          </div>
          <lang-tabs/>
          <q-list>
            <q-item v-for="file in scope.files" :key="file.name">
              <q-item-section
                  v-if="file.__img"
                  class="gt-xs"
                  avatar
              >
                  <q-img :src="file.__img.src" :ratio="1" style="width: 4em; height: 4em" contain/>
              </q-item-section>
              <q-item-section
                  v-if="!file.__img"
                  class="gt-xs"
                  avatar
              >
                <q-icon name="attachment" style="width: 3.5rem; "/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="full-width ellipsis">
                  {{ file.name }}
                </q-item-label>
                <q-item-label caption>
                  {{ $t('media.status.title') }}: {{ $t(`media.status.${file.__status}`) }}
                </q-item-label>
                <q-linear-progress stripe style="height: 2px; " color="positive" :value="file.__progress"  />
              </q-item-section>
              <q-item-section top side>
                <q-btn
                    class="gt-xs"
                    size="12px"
                    color="grey-4"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="scope.removeFile(file)"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <div class="row justify-around q-mt-md" v-if="scope.files.length !== 0">
            <q-btn flat>{{ $t('general.cancel')}}</q-btn>
            <q-btn color="positive">{{ $t('media.upload')}}</q-btn>
          </div>
        </template>
      </q-uploader>
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
