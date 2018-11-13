<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header class="no-shadow">
      <q-toolbar
        color="primary"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          v-if="!leftDrawerOpen"
        >
            <q-icon name="fa fa-bars" />
        </q-btn>

        <q-toolbar-title>
          <h1 class="no-margin">{{ $t('general.title') }}</h1>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      class="no-shadow"
      v-model="leftDrawerOpen"
      :content-class="($q.theme === 'mat' ? 'bg-secondary' : '') + ' no-shadow'"
    >
      <q-list
        no-border
        link
        inset-delimiter
        class="no-margin no-padding"
      >
        <q-list-header class="bg-tertiary relative-position">
          <img alt="Kusikusi logo" src="~assets/logo.svg">
          <q-btn
                  flat
                  dense
                  round
                  @click="leftDrawerOpen = !leftDrawerOpen"
                  aria-label="Menu"
          >
            <q-icon name="fa fa-caret-left" class="gt-md" />
            <q-icon name="fa fa-times" class="lt-lg" color="white" />
          </q-btn>
        </q-list-header>
        <!--<q-item @click.native="$router.push('/dashboard')">
          <q-item-side icon="fa fa-tachometer-alt" />
          <q-item-main :label="'layout.dashboard' | translate"/>
        </q-item>-->
        <q-item @click.native="$router.push('/content/edit/ ')">
          <q-item-side icon="fa fa-list" />
          <q-item-main :label="'layout.content' | translate"  />
        </q-item>
        <q-item @click.native="$router.push('/media')">
          <q-item-side icon="fa fa-image" />
          <q-item-main :label="'layout.media' | translate" />
        </q-item>
        <q-item @click.native="$router.push('/users')">
          <q-item-side icon="fa fa-users" />
          <q-item-main :label="'layout.users' | translate" />
        </q-item>
        <q-item @click.native="$router.push('/config')">
          <q-item-side icon="fa fa-cog" />
          <q-item-main :label="'layout.configuration' | translate" />
        </q-item>
        <q-item @click.native="$router.push('/login')">
          <q-item-side icon="fa fa-sign-out-alt" />
          <q-item-main :label="'layout.logout' | translate" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'LayoutInside',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      drawer: null
    }
  },
  methods: {
    openURL
  }
}
</script>

<style lang="stylus">
  @import '~variables'
  $header-height = 72px;
  .q-toolbar {
    height: $header-height;
    h1 {
      font-size: ($header-height / 2);
    }
  }
  .q-list {
    .q-list-header {
      padding: ($header-height * .1) 0;
      text-align center;
      height: ($header-height);
      @media all and (min-width: $sizes.lg) {
        .q-btn {
          right: ($header-height / -4);
          top: ($header-height / 4);
          position: absolute;
          .q-icon {
            font-size: ($header-height / 1.25);
            color: white;
            background-color: $primary;
            width: ($header-height / 2);
            height: ($header-height / 2);
            border-radius: ($header-height / 4)
          }
        }
      }
      @media all and (max-width: $sizes.lg) {
        .q-btn {
          right: 0;
          top: 0;
          position: absolute;
          .q-icon {
            font-size: ($header-height / 4);
            color: white;
          }
        }
      }
      img {
        height ($header-height * .8);
        width: auto;
        max-width: ($header-height * 3);
        display: block;
        margin: 0 auto;
      }
    }
  }
  .q-item {
    color: white;
    font-size: ($header-height / 4);
    padding: ($header-height * .2)
    .q-icon {
      color: rgba(0, 0, 0, 0.66);
      background-color: rgba(255, 255, 255, 0.33);
      width: ($header-height / 2);
      height: ($header-height / 2);
      border-radius: ($header-height / 4)
    }
    .q-item-section + .q-item-section {
    }
  }
</style>
